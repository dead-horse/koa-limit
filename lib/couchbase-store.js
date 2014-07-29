'use strict';

var CouchbaseStore = module.exports = function(connect){
    if(!(this instanceof CouchbaseStore)){
        return new CouchbaseStore(connect);
    }
    
    this.client = connect;
};

CouchbaseStore.prototype.hget = function *(hashKey, field){
    var data = null;
    try{
        data = yield this.client.Get(hashKey);
    }catch(e){}
    
    if(data && data.length > 1) data = data.shift();
    
    if(field === null){
        return !data? null : data;
    }else{
        return !data? 0 : (data[field] || 0);
    }
};

CouchbaseStore.prototype.hincrby = function *(hashKey, field, value){
    var ttl = 18000, //5 hours
        data = yield this.hget(hashKey, null);
    
    if(data === null){
        data = {};
        data[field] = 0;
    }else if(!data[field]){
        data[field] = 0;
    }
    
    data[field] += value;
    
    yield this.client.Set(hashKey, data, null, ttl);
};

CouchbaseStore.prototype.del = function *(hashKey){
    try{
        yield this.client.Del(hashKey);
    }catch(e){}
};
