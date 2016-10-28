var express = require('express');
var bodyParser = require('body-parser');

var Storage = {
  add: function(name) {
    var item = {name: name, id: this.setId};
    this.items.push(item);
    this.setId += 1;
    return item;
  },
  delete: function(id) {
      var arr1 = this.items.slice(0, Number(id) - 1);
      var arr2 = this.items.slice( Number(id), this.items.length );
      this.items = arr1.concat(arr2);
      
      for (var i = 0; i < this.items.length; i++ ) {
          this.items[i].id = i + 1;
      }
      this.setId = this.items.length;
      
      return this.items;
  },
  put: function(name, id) {
      this.items[id-1].name = name;
      return this.items[id-1];
  }
};

var createStorage = function() {
  var storage = Object.create(Storage);
  storage.items = [];
  storage.setId = 1;
  return storage;
}

var storage = createStorage();

storage.add('Broad beans');
storage.add('Tomatoes');
storage.add('Peppers');

var app = express();
app.use(express.static('public'));

app.get('/items', function(request, response) {
    response.json(storage.items);
});

app.listen(process.env.PORT || 8080, process.env.IP);

var jsonParser = bodyParser.json();


app.post('/items', jsonParser, function(request, response) {
    if (!('name' in request.body)) {
        return response.sendStatus(400);
    }

    var item = storage.add(request.body.name);
    response.status(201).json(item);
});


app.delete('/items/:id', jsonParser, function(request, response) {
    
    var id = request.params.id;
    
    if (storage.items[Number(id) - 1] === 'undefined') {
        return response.sendStatus(400);
    }

    var item = storage.delete(id);
    response.status(200).json(item);
});

app.put('/items/:id', jsonParser, function(request, response) {

    var id = Number(request.body.id);
    var name = request.body.name;
    
    if (storage.items[id - 1] === 'undefined') {
        return response.sendStatus(400);
    }
    
    var item = storage.put(name, id);
    response.status(200).json(item);
});
