/**
 * Created by steb on 16.02.2015.
 */
describe('c1', function(){
    beforeAll(function(){
        console.log('c1: before');
    });

    beforeEach(function(){
        console.log('c1: beforeEach');
    });

    it('t1', function(){
        console.log('c1-t1');
        console.log('');
        expect(true).toBeTruthy();
    });

    describe('c2', function(){
        beforeAll(function(){
            console.log('c2: before');
        });

        beforeEach(function(){
            console.log('c2: beforeEach');
        });

        it('t1', function(){
            console.log('c2-t1');
            console.log('');
            expect(true).toBeTruthy();
        });

        it('t2', function(){
            console.log('c2-t2');
            console.log('');
            expect(true).toBeTruthy();
        });
    });
});
