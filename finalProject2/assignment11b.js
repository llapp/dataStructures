// ------------------------------------------------
// weekly assignment 11 for Final Assignment 2
// ------------------------------------------------

var http = require('http');
var pg = require('pg');

// supply connection string through an environment variable
var conString = "postgres://llapp:edmontonab@data-structures.cofujylv8rqe.us-west-2.rds.amazonaws.com:5432/postgres";

var server = http.createServer(function(req, res) {

    // get a pg client from the connection pool
    pg.connect(conString, function(err, client, done) {

        var handleError = function(err) {
            // no error occurred, continue with the request
            if (!err) return false;

            // An error occurred, remove the client from the connection pool.
            // A truthy value passed to done will remove the connection from the pool
            // instead of simply returning it to be reused.
            // In this case, if we have successfully received a client (truthy)
            // then it will be removed from the pool.
            if (client) {
                done(client);
            }
            res.writeHead(500, {'content-type': 'text/plain'});
            res.end('An error occurred');
            return true;
        };

        // handle an error from the connection
        if (handleError(err)) return;

        // client.query('SELECT COUNT(*) AS count FROM laptopData WHERE dateTime >= DATEADD(day,-7, GETDATE());', function(err, result) {
        // client.query('SELECT * FROM laptopData;', function(err, result) {
        client.query(writeDateQuery(), function(err, result) {

            // handle an error from the query
            if (handleError(err)) return;

            // return the client to the connection pool for other requests to reuse
            done();
            res.writeHead(200, {'content-type': 'text/html'});
            res.write(JSON.stringify(result.rows));
            res.end();
        });
    });
});

server.listen(process.env.PORT);

function writeDateQuery () {
    process.env.TZ = 'America/New_York';
    var dateToday = new Date();
    var dateOneWeekAgo = new Date(dateToday - 60*60*24*1000*7); 

    var year = dateOneWeekAgo.getFullYear();
    var month = dateOneWeekAgo.getMonth() + 1; 
    var day = dateOneWeekAgo.getDate();
    year = year.toString(); 
    month = month.toString();
    day = day.toString();
    if (month.length == 1) {
        month = '0' + month;
    }
        if (day.length == 1) {
        day = '0' + day;
    }
    var toReturn = 'SELECT * FROM laptopData where dateTime > ' + "'" + year + '-' + month + '-' + day + "';"; 
    return toReturn;
}