import React from 'react';

const SvgInline = (props: {
  component: JSX.Element;
  className?: string;
  id?: string;
}): JSX.Element => {
  return (
    <div className={props.className} id={props.id}>
      {props.component}
    </div>
  );
};

export default SvgInline;
