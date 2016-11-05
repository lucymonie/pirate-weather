QUnit.test("that we can add topics to the database object", function(assert){
  var done = assert.async();
  var weatherObj = Object.assign({}, headlines[0]); /* This creates a copy of headlines[0] */
  requestConstructor(headline);
  setTimeout(function(){
    assert.ok(headline.topics, 'Passed!');
    done();
  },1000);
});
