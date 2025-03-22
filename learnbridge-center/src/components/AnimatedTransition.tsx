
import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

interface AnimatedTransitionProps {
  children: React.ReactNode;
  location: string;
}

const AnimatedTransition: React.FC<AnimatedTransitionProps> = ({ children, location }) => {
  return (
    <TransitionGroup>
      <CSSTransition
        key={location}
        timeout={400}
        classNames="page-transition"
        unmountOnExit
      >
        {children}
      </CSSTransition>
    </TransitionGroup>
  );
};

export default AnimatedTransition;
