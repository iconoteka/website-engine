const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');
const nodeFetch = require('node-fetch');
let globalRetryCount = 0;

const fetch = require('fetch-retry')(nodeFetch, {
    retries: 5,
    retryDelay: function(attempt, error, response) {
        globalRetryCount++;
        console.log('', error.message, `Retrying (${attempt+1} attempt) \nTotal retries: ${globalRetryCount}`);
        return 0;
      }
  });

const Figma = require('figma-js');
const slugify = require('@sindresorhus/slugify');
const mkdirp = require('mkdirp');
const ProgressBar = require('progress');
const findUp = require('find-up');
const { default: PQueue } = require('p-queue');

const configPath = findUp.sync('iconoteka.config.js', {
    cwd: path.resolve(path.join(__dirname, '../../'))
});
const config = require(configPath);

console.log(`Downloading from Figma: using config "${configPath}" `);

if (!config) {
    console.error('Cant find iconoteka.config.js');
    process.exit(1);
}

if (!config.figma) {
    console.log('No figma section in iconoteka.config.js. Exiting');
    process.exit(0);
}

const requestsQueue = new PQueue({ concurrency: 100 });

const COMPONENT_NODE_TYPES = ['COMPONENT', 'INSTANCE'];
const CONTAINER_NODE_TYPES = ['CANVAS', 'FRAME'];

const isIcon = node => COMPONENT_NODE_TYPES.includes(node.type); 
const isContainer = node => CONTAINER_NODE_TYPES.includes(node.type); 

const figmaToken = config.figma.apiToken;
const fileID = config.figma.fileId;
const startNodeId = config.figma.startNodeId; // Page ID, if missing all pages will be included
const fileFormat = config.figma.format || 'svg';
const scale = config.figma.scale || '1'; 
const chunkSize = config.figma.requestChunkSize || 500; // In order to avoid 500 and 414 errors from Figma we split requests into several chunks 

const targetDirAssets = config.figma.targetDir || `${process.cwd()}/iconoteka`;
const cleanTargetDir = config.figma.cleanTargetDir || true;

if (cleanTargetDir) {
    rimraf.sync(`${targetDirAssets}/**`);
}

const getStartNode = (file, nodeId) => {

    if (nodeId) {
        // TODO: Recursive search
        const page = file.document.children.find(
            item => item.id === startNodeId
        );

        if (!page) {
            throw new Error(`Start node ${nodeId} not found`);
        }
        return page;
    }

    return file.document;
};

const chunkArray = (arr, chunkSize) => {
    var R = [];
    for (var i=0,len=arr.length; i<len; i+=chunkSize)
      R.push(arr.slice(i,i+chunkSize));
    return R;
}

const fillItemProps = item => { 

    return {
        isFill: true,
        isStroke: true,
        isBold: true,
        isMedium: true,
        isRegular: true,
        isLight: true,
        name: item.name,
        path: item.fileName
      }
}

const fillItemPropsCallback = config.figma.fillItemProps || fillItemProps;

async function main() {

    await mkdirp(targetDirAssets);

    if (!figmaToken) {
        console.error('No figma token provided');
        process.exit(1);
    }
    const client = Figma.Client({
        personalAccessToken: figmaToken,
    });
    
    console.log('Getting Figma file');

    const file = await client.file(fileID);
    
    const startNode = getStartNode(file.data, startNodeId);

    const getComponentsFlat = function(container, parentContainerName = '') {
        console.log(`Processing container ${container.name}, id: ${container.id}`);
        if (!isContainer(container)) {
            console.warn(container.name, `"${container.type}"`, 'Not a container');
            return [];
        }

        const items = [];

        container.children.forEach(item => {
            const containerName = parentContainerName 
                ? `${parentContainerName} / ${container.name}`
                : container.name;
            
            if (isIcon(item)) {

                items.push({ 
                    ...item,
                    containerName,
                    fileName: `${slugify(container.name, {replacement: '_'})}_${slugify(item.name, {replacement: '_'}).replace(' ', '_')}.${fileFormat}`,
                });
            } else if (isContainer(item)) {
                items.push(...getComponentsFlat(item, containerName));
            }
        });

        return items;
    };

    const items = [];

    console.log('StartNode', startNode.name, startNode.id);
    startNode.children.forEach(child => {
        
        const components = getComponentsFlat(child);
        items.push(...components);
    }); 

    const progress = new ProgressBar('Downloading files: :current of :total', { total: items.length });
    console.log(`Found ${items.length} components`);

    const itemIds = items.map(item => item.id);

    console.log('Figma: requesting file urls');
    
    const itemIdsByChunks = chunkArray(itemIds, chunkSize);
    
    const getImages = (fileID, fileFormat, scale, items) => {
        return client.fileImages(fileID, {
            ids: items,
            format: fileFormat,
            scale,
          });
    }
    
    const getImagesPromises = itemIdsByChunks.map(items => getImages(fileID, fileFormat, scale, items));
    const imagesResponses = await Promise.all(getImagesPromises).catch(error => {
        console.log(`Error while getting urls from figma`);
        console.log(`${error.response.status}: ${error.response.statusText}`);
        console.log('Response data:', error.response.data);
        process.exit(1);
    });

    const images = imagesResponses.reduce((acc, responce) => {
        return Object.assign({}, acc, responce.data.images);
    },[]);

    itemsWithUrls = items.map(item => {
      if (images.hasOwnProperty(item.id)) {
        item.url = images[item.id];
        return item;
      }
    });

    console.log('Saving files');

    itemsWithUrls.forEach(item => {
        requestsQueue.add(() => fetch(item.url)
        .then(res => {
            item.path = `${targetDirAssets}/${item.fileName}`;
            const dest = fs.createWriteStream(item.path);
            res.body.pipe(dest);
            dest.on('finish', () => progress.tick());
        }));
    });


    itemsGroupped = {};

    itemsWithUrls.forEach(item => {
        if (!itemsGroupped[item.containerName]) {
            
            itemsGroupped[item.containerName] = [];
        }

        itemsGroupped[item.containerName].push(item);
    });

    const iconoteka = {
        name: "iconoteka",
        items: []
    };

    const groupNames = Object.keys(itemsGroupped);

    groupNames.forEach(groupName => {
        groupItems = itemsGroupped[groupName].map(groupItem => {
            return fillItemPropsCallback(groupItem);
        });
    
        iconoteka.items.push({
            name: groupName,
            items: groupItems,
        });
    });

    console.log('Saving iconoteka.json');

    fs.writeFileSync(`${targetDirAssets}/iconoteka.json`, JSON.stringify(iconoteka, null, 2));

}

main();
