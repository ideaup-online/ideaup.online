import retext from 'retext';
import smartypants from 'retext-smartypants';

const SmartQuote = ({ children }) => {
  const text = retext().use(smartypants).processSync(children);

  return '' + text;
};

export default SmartQuote;
