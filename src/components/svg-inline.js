import React from 'react';

const SvgInline = (props) => {
  if (props.component) {
    return (
      <div className={props.className} id={props.id}>
        {props.component()}
      </div>
    );
  }

  return <div></div>;
};

export default SvgInline;
