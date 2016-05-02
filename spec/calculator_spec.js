var calculator = require('../scripts/js/calculator').calculate;

console.log('Running tests...');
describe('Calculator', function(){
	it('should solve 3 + 4 as 7', function(done){
		var solution = calculator('3 + 4');
		expect(solution).toBe('7');
		done();
	});

	it('should solve -3 + 2', function(done){
		var solution = calculator('-3 + 2');
		expect(solution).toBe('-1');
		done();
	});

	it('should solve 15/2', function(done){
		var solution = calculator('15/2');
		expect(solution).toBe('7.5');
		done();
	});

	it('should solve -9.3-3', function(done){
		var solution = calculator('-9.3-3');
		expect(solution).toBe('-12.3');
		done();
	});

	it('should solve 5*(2+3)+15/5+2**3', function(done){
		var solution = calculator('5*(2+3)+15/5+2**3');
		expect(solution).toBe('36');
		done();
	});

	it('should solve 15 - -2', function(done){
		var solution = calculator('15 - -2');
		expect(solution).toBe('17');
		done();
	});

	it('should solve -33 + -4', function(done){
		var solution = calculator('-33 + -4');
		expect(solution).toBe('-37');
		done();
	});

	it('should solve 5**3', function(done){
		var solution = calculator('5**3');
		expect(solution).toBe('125');
		done();
	});

	it('should solve 2**-2', function(done){
		var solution = calculator('2**-2');
		expect(solution).toBe('0.25');
		done();
	});

	it('should solve 1/4+2/3',function(done){
		var solution = calculator('1/4+2/3');
		expect(solution).toBe('0.9166666666666666');
		done();
	});

	it('should solve -3 - -1', function(done){
		var solution = calculator('-3 - -1');
		expect(solution).toBe('-2');
		done();
	});

	it('should solve 1/0', function(done){
		var solution = calculator('1/0');
		expect(solution).toBe('Infinity');
		done();
	});

	it('should solve 0/0', function(done){
		var solution = calculator('0/0');
		expect(solution).toBe('NaN');
		done();
	});

	it('should solve 100000000000000*10000000000', function(done){
		var solution = calculator('100000000000000*10000000000');
		expect(solution).toBe('1e+24');
		done();
	});

	it('should solve -9.3/-3.1', function(done){
		var solution = calculator('-9.3/-3.1');
		expect(solution).toBe('3');
		done();
	});

});