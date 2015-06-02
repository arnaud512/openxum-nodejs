OpenXum
=============

An open framework for turn games

Technology
------------

| On The Server | On The Client  | Development |
| ------------- | -------------- | ----------- |
| Express       | Bootstrap      | Grunt       |
| Jade          | Backbone.js    | Bower       |
| Mongoose      | jQuery         |             |
| Passport      | Underscore.js  |             |
| Async         | Font-Awesome   |             |
| EmailJS       | Moment.js      |             |
| WebSocket     |                |             |
| Easy-captcha  |                |             |
| I18n-2        |                |             |
| Zombie        |                |             |
| Cucumber      |                |             |

Requirements
------------

You need [Node.js](http://nodejs.org/download/) and [MongoDB](http://www.mongodb.org/downloads) installed and running.

We use [Grunt](http://gruntjs.com/) as our task runner. Get the CLI (command line interface).

```bash
$ npm install grunt-cli -g
```

We use [Bower](http://bower.io/) as our front-end package manager. Get the CLI (command line interface).

```bash
$ npm install bower -g
```

We use [`bcrypt`](https://github.com/ncb000gt/node.bcrypt.js) for hashing secrets. If you have issues during installation related to `bcrypt` then [refer to this wiki page](https://github.com/jedireza/drywall/wiki/bcrypt-Installation-Trouble).

Installation
------------

```bash
$ git clone git@github.com:openxum-team/openxum-nodejs.git && cd ./openxum-nodejs
$ npm install && bower install
$ grunt
```

Setup
------------

You need a few records in the database to start using the user system.

Run these commands on mongo. __Obviously you should use your email address.__

```js
use openxum; //your mongo db name
```

```js
db.admingroups.insert({ _id: 'root', name: 'Root' });
db.admins.insert({ name: {first: 'Root', last: 'Admin', full: 'Root Admin'}, groups: ['root'] });
var rootAdmin = db.admins.findOne();
db.users.save({ username: 'root', isActive: 'yes', email: 'admin@openxum.org', roles: {admin: rootAdmin._id} });
var rootUser = db.users.findOne();
rootAdmin.user = { id: rootUser._id, name: rootUser.username };
db.admins.save(rootAdmin);
db.gametypes.insert({name: 'dvonn'});
db.gametypes.insert({name: 'invers'});
db.gametypes.insert({name: 'gipf'});
db.gametypes.insert({name: 'kamisado'});
db.gametypes.insert({name: 'pentago'});
db.gametypes.insert({name: 'tzaar'});
db.gametypes.insert({name: 'yinsh'});
db.gametypes.insert({name: 'zertz'});
db.gametypes.insert({name: 'paletto'});
```

Now just use the reset password feature to set a password.

 - `http://localhost:3000/login/forgot/`
 - Submit your email address and wait a second.
 - Go check your email and get the reset link.
 - `http://localhost:3000/login/reset/:email/:token/`
 - Set a new password.

Login. Customize. Enjoy.