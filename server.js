let express = require("express");
let { Client } = require("pg");
let app = express();
app.use(express.json());
app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header(
		"Access-Control-Allow-Methods",
		"GET,POST,OPTIONS,PUT,PATCH,DELETE,HEAD"
	);
	res.header(
		"Access-Control-Allow-Headers",
		"Origin,X-Requested-With,Content-Type,Accept"
	);
	next();
});

// const port = 2410;
var port = process.env.PORT || 2410;
app.listen(port, () => console.log(`Node app listening on port ${port}`));

const connection = new Client({
	user: "postgres",
	password: "ABabluKumar",
	database: "postgres",
	port: 5432,
	host: "db.lwjkdhdkfsmentvysimf.supabase.co",
	ssl: { rejectUnauthorized: false },
});
connection.connect(function (res, error) {
	console.log(`Connected!!!`);
});

app.get("/mobiles", (req, res) => {
	let { sort,brand,ram,rom } = req.query;
	connection.query(`select * from mobiles ${sort ? `order by ${sort} asc ` : ""}`, (err, result) => {
		if (err) console.log(err);
		else {
			let arr1 = [...result.rows];
			if(brand) arr1  = arr1.filter(a=>brand.split(",").findIndex(b=>b===a.brand)>=0);
			if(rom) arr1  = arr1.filter(a=>rom.split(",").findIndex(b=>b===a.rom)>=0);
			if(ram) arr1  = arr1.filter(a=>ram.split(",").findIndex(b=>b===a.ram)>=0);
			res.send(arr1);
		};
	});
});

app.get("/mobiles/:id", (req, res) => {
	let id = +req.params.id;
	connection.query(`select * from mobiles where id = $1`,[id], (err, result) => {
		if (err) console.log(err);
		else res.send(result.rows[0]);
	});
});

app.get("/mobiles/brand/:brand", (req, res) => {
	let { sort } = req.query;

	let brand = req.params.brand;
	connection.query(
		`select * from mobiles where brand = $1 ${sort ? `order by ${sort} asc ` : ""}`,
		[brand],
		(err, result) => {
			if (err) console.log(err);
			else res.send(result.rows);
		}
	);
});

app.get("/mobiles/ram/:ram", (req, res) => {
	let { sort } = req.query;

	let ram = req.params.ram;
	connection.query(
		`select * from mobiles where ram = $1 ${sort ? `order by ${sort} asc ` : ""}`,
		[ram],
		(err, result) => {
			if (err) console.log(err);
			else res.send(result.rows);
		}
	);
});

app.get("/mobiles/rom/:rom", (req, res) => {
	let { sort } = req.query;

	let rom = req.params.rom;
	connection.query(
		`select * from mobiles where rom = $1 ${sort ? `order by ${sort} asc ` : ""}`,
		[rom],
		(err, result) => {
			if (err) console.log(err);
			else res.send(result.rows);
		}
	);
});

app.get("/mobiles/os/:os", (req, res) => {
	let { sort } = req.query;

	let os = req.params.os;
	connection.query(
		`select * from mobiles where os = $1 ${sort ? `order by ${sort} asc ` : ""}`,
		[os],
		(err, result) => {
			if (err) console.log(err);
			else res.send(result.rows);
		}
	);
});

app.post("/mobiles", (req, res) => {
	let mobile = Object.values(req.body);
	console.log(mobile);
	connection.query(
		"insert into mobiles(name,price,brand,ram,rom,os) values($1,$2,$3,$4,$5,$6)",
		mobile,
		(err, result) => {
			if (err) console.log(err);
			else res.send("mobile inserted");
		}
	);
});

app.put("/mobiles/edit/:id",(req,res)=>{
	let id = +req.params.id;

	let mobile = Object.values({...req.body,id:id});
	
    mobile.splice(0,1);
	mobile.push(id);
	connection.query("update mobiles set name=$1,price=$2,brand=$3,ram=$4,rom=$5,os=$6 where id = $7 ",mobile,(err,result)=>{
		if(err) console.log(err);
		else res.send("updated")
	})
})

app.delete("/mobiles/delete/:id",(req,res)=>{
	let id = +req.params.id;
	connection.query("delete from mobiles where id = $1 ",[id],(err,result)=>{
		if(err) console.log(err);
		else res.send("deleted")
	})
})

