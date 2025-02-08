import '@testing-library/jest-dom';
import { server } from './src/tests/helpers';

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close()); 