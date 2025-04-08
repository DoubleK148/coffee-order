import '@testing-library/jest-dom';
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import matchers from '@testing-library/jest-dom/matchers';

// Mở rộng Vitest với các matchers từ @testing-library/jest-dom
expect.extend(matchers);

// Dọn dẹp sau mỗi test
afterEach(() => {
  cleanup();
}); 