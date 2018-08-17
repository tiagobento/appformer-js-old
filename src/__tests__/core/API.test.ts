import * as ReactDOM from 'react-dom';

(ReactDOM as any).render = jest.fn();
import * as API from 'core/API';

test('teste real', () => {
    expect(API.sum(1, 2)).toBe(3);
});
