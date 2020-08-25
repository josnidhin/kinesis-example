/**
 * @author Jose Nidhin
 */
'use strict';

const AWS = require('aws-sdk'),
  Logger = require('pino')(),

  Kinesis = new AWS.Kinesis({
    apiVersion: '2013-12-02',
    region: 'ap-southeast-1'
  }),

  STREAM_NAME = 'demo-test';

/**
 *
 */
async function start ({ fromBegining }) {
  const logMsg = 'start';

  try {
    const shardId = await getShardId(),
      shardIterator = await getShardIterator({ shardId, fromBegining });

    await consume(shardIterator);
  } catch (err) {
    Logger.error({ err }, logMsg);
  }
}

/**
 *
 */
async function getShardId () {
  const logMsg = 'getShardId',
    params = {
      StreamName: STREAM_NAME
    },

    { Shards } = await Kinesis.listShards(params).promise();
  Logger.info({ Shards }, logMsg);

  return Shards[0].ShardId;
}

/**
 *
 */
async function getShardIterator ({ shardId, fromBegining }) {
  const logMsg = 'getShardIterator',
    iteratorType = fromBegining
      ? 'TRIM_HORIZON'
      : 'LATEST',

    params = {
      StreamName: STREAM_NAME,
      ShardId: shardId,
      ShardIteratorType: iteratorType
    },

    { ShardIterator } = await Kinesis.getShardIterator(params).promise();
  Logger.info({ ShardIterator }, logMsg);

  return ShardIterator;
}

/**
 *
 */
async function consume (shardIterator) {
  const logMsg = 'consume';

  if (!shardIterator) {
    setTimeout(() => {
      start({ fromBegining: false });
    }, 5000);
    return;
  }

  const params = {
    ShardIterator: shardIterator
  };

  let nextShardIterator;

  try {
    const data = await Kinesis.getRecords(params).promise();
    printRecords(data.Records);
    nextShardIterator = data.NextShardIterator;
  } catch (err) {
    Logger.error({ err }, logMsg);
  } finally {
    setImmediate(() => {
      consume(nextShardIterator);
    });
  }
}

/**
 *
 */
function printRecords (records) {
  records.forEach((record) => {
    const { SequenceNumber, Data, PartitionKey } = record;

    Logger.info({
      SequenceNumber,
      PartitionKey,
      Data: Data.toString()
    }, 'printRecords');
  });
}

start({ fromBegining: true });
