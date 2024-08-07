import { parseAmountArg } from './utils';

test('[parseAmountArg] test parsing of percentages', async () => {
  expect(parseAmountArg('20%')).toEqual({ type: 'percent', amount: 20 });
  expect(parseAmountArg('110,41%')).toEqual({
    type: 'percent',
    amount: 110.41,
  });
  expect(parseAmountArg('110.41%')).toEqual({
    type: 'percent',
    amount: 110.41,
  });
  let error1: null | string = null;
  expect(() => parseAmountArg('a%')).toThrow(
    new Error('Invalid --amount percentage')
  );
});

test('[parseAmountArg] test parsing of absolute', async () => {
  expect(parseAmountArg('20')).toEqual({ type: 'absolute', amount: 20 });
  expect(parseAmountArg('110,41')).toEqual({
    type: 'absolute',
    amount: 110.41,
  });
  expect(parseAmountArg('110.41')).toEqual({
    type: 'absolute',
    amount: 110.41,
  });
  let error1: null | string = null;
  expect(() => parseAmountArg('x')).toThrow(
    new Error('Invalid --amount absolute')
  );
});
