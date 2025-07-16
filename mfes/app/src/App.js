import React, { Suspense, lazy } from 'react';
import Header from './components/Header';

const Positions = lazy(() => import('positions/App'));

const App = () => {
  return (
    <div>
      <Header />
      <main>
        <Suspense fallback={<div>Loading...</div>}>
            <Positions />
        </Suspense>
      </main>
    </div>
  );
};

export default App;
