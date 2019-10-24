require('./config/db');
const express = require('express');
const app = express();
const port = process.env.port || 3000;
const path = require('path');
const cors = require('cors');
const exphbs = require('express-handlebars');
const flash = require('connect-flash');
const session = require('express-session');
const bodyparser = require(body)