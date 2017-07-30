import * as React from 'react';
import Content from './content.component';

export default () => {
  let times = 'once';
  let text = 'i am *_bold and underline_* and **you** are not at http://www.google.com . . .  or are you?';
  return (
    <div>
      <h2>My mother made me an app {times}. . . {times.toUpperCase()}!</h2>
      <Content text={text} />
    </div>
  );
};