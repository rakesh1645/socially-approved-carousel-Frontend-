import '@testing-library/jest-dom/vitest';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
afterEach(cleanup);
class IntersectionObserverMock { observe() {} disconnect() {} unobserve() {} }
global.IntersectionObserver = IntersectionObserverMock;
Object.defineProperty(HTMLMediaElement.prototype,'pause',{configurable:true,value:vi.fn()});
Object.defineProperty(HTMLMediaElement.prototype,'load',{configurable:true,value:vi.fn()});
Object.defineProperty(HTMLMediaElement.prototype,'play',{configurable:true,value:vi.fn(() => Promise.resolve())});
