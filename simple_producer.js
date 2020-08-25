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

  STREAM_NAME = 'demo-test',

  NAMES = {
    1: 'Adam',
    2: 'John',
    3: 'Kelly',
    4: 'Jane',
    5: 'Bob'
  };

/**
 *
 */
function genMessage () {
  const id = Math.round(Math.random() * 4) + 1,
    score = Math.round(Math.random() * 99) + 1;

  return {
    id,
    score,
    name: NAMES[id]
  };
}

/**
 *
 */
async function publish () {
  const logMsg = 'publish',
    message = genMessage(),

    params = {
      Data: JSON.stringify(message),
      PartitionKey: `${message.id}`,
      StreamName: STREAM_NAME
    };

  Logger.info({ params }, logMsg);

  try {
    await Kinesis.putRecord(params).promise();
  } catch (err) {
    Logger.error({ err }, logMsg);
  } finally {
    setImmediate(() => {
      publish();
    });
  }
}

publish();
