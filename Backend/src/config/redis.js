const { createClient } =require('redis');



const redisClient = createClient({
    username: 'default',
    password: '2ryxrb4MqG0lBz9lz5UClg3q9hFvMbDP',
    socket: {
        host: 'redis-10434.c267.us-east-1-4.ec2.cloud.redislabs.com',
        port: 10434
    }
});

module.exports=redisClient;