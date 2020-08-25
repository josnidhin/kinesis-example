# Kinesis Example

## Install Dependencies
```shell
> npm i
```

## Run Simple Producer
```shell
> node simple_producer.js
```
__Note__: Expects a Kinesis Data Stream named `demo-test` with one shard.

## Run Simple Consumer
```shell
> node simple_consumer.js
```
__Note__
* Expects a Kinesis Data Stream named `demo-test` with one shard.
* Enhanced Fan-Out Consumer is not possible with Node AWS SDK as
`SubscribeToShard` function is missing.
