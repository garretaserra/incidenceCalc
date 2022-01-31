
class TestScripts {
    async test(req, res){
        res.status(200).send('It works');
    };
    
}

export = new TestScripts()