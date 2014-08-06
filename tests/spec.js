describe('calculator', function () {
  var total_passngrs = element(by.model('param1'));
  var passngr_growth = element(by.model('param2'));
  var num_tickets_issued = element(by.model('param3'));
  var pc_tickets_reissued = element(by.model('param4'));
  var labour_costs = element(by.model('param5'));
  var air_revenue = element(by.model('param6'));
  var ann_cst_bse = element(by.model('param7'));
  var ann_dist_rate = element(by.model('param8'));
  var av_yield_p_ticket = element(by.model('param9'));
  var ann_fuel_rate = element(by.model('param10'));
  var cal_adjust = element(by.model('adjustment'));
  var var_revenue_integrity_proc_imp = element(by.binding('var_revenue_integrity_proc_imp'));
  var ref1 = element(by.binding('ref1()'));
  var ref2 = element(by.binding('ref2()'));
  var ref3 = element(by.binding('ref3()'));
  var ref4 = element(by.binding('ref4()'));
  var ref5 = element(by.binding('ref5()'));
  var ref6 = element(by.binding('ref6()'));
  var ref7 = element(by.binding('ref7()'));
  var ref8 = element(by.binding('ref8()'));
  var ref9 = element(by.binding('ref9()'));
  var ref10 = element(by.binding('ref10()'));
  var ref11 = element(by.binding('ref11()'));
  var ref12 = element(by.binding('ref12()'));
  var ref13 = element(by.binding('ref13()'));

  function addNumbers () {
    total_passngrs.clear().sendKeys(6500000);
    passngr_growth.clear().sendKeys(3);
    num_tickets_issued.clear().sendKeys(3611111);
    pc_tickets_reissued.clear().sendKeys(10);
    labour_costs.clear().sendKeys(7);
    air_revenue.clear().sendKeys(2500000000);
    ann_cst_bse.clear().sendKeys(2565000000);
    ann_dist_rate.clear().sendKeys(15);
    av_yield_p_ticket.clear().sendKeys(100);
    ann_fuel_rate.clear().sendKeys(34);
    cal_adjust.clear().sendKeys(1000000);
  }

  beforeEach(function () {
    browser.get('http://hoz_calculator.dev/#/calculator');
  });

  it('should have a title', function () {
    expect(browser.getTitle()).toEqual('Horizon Calculator');
  });

  it('var_revenue_integrity_proc_imp should equal 37', function () {
    addNumbers();
    expect(var_revenue_integrity_proc_imp.getText()).toEqual('37');
  });

  it('revenue ref:1 should equal 234000', function () {
    expect(ref1.getText()).toEqual('234000');
  });

  it('revenue ref:2 should equal 421200', function () {
    expect(ref2.getText()).toEqual('421200');
  });

  it('revenue ref:3 should equal  374400', function () {
    expect(ref3.getText()).toEqual('374400');
  });

  it('revenue ref:4 should equal  2.88', function () {
    expect(ref4.getText()).toEqual('2.88');
  });

  it('revenue ref:5 should equal 673920', function () {
    expect(ref5.getText()).toEqual('673920');
  });

  it('revenue ref:6 should equal 237125', function () {
    expect(ref6.getText()).toEqual('237125');
  });

  it('revenue ref:7 should equal 23712.5', function () {
    expect(ref7.getText()).toEqual('23712.5');
  });

  it('revenue ref:8 should equal 2371250', function () {
    expect(ref8.getText()).toEqual('2371250');
  });

  it('revenue ref:9 should equal 28455000', function () {
    expect(ref9.getText()).toEqual('28455000');
  });

  it('revenue ref:10 should equal 195000', function () {
    expect(ref10.getText()).toEqual('195000');
  });

  it('revenue ref:11 should equal 39000', function () {
    expect(ref11.getText()).toEqual('39000');
  });

  it('revenue ref:12 should equal 17550000', function () {
    expect(ref12.getText()).toEqual('17550000');
  });

  it('revenue ref:13 should equal 37230000', function () {
    expect(ref13.getText()).toEqual('37230000');
  });

});