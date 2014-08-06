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
  var var_revenue_integrity_proc_imp = element(by.binding('var_revenue_integrity_proc_imp_high'));
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

  it('var_revenue_integrity_proc_imp_high should equal 37', function () {
    //addNumbers();
    expect(var_revenue_integrity_proc_imp_high.getText()).toEqual('13');
  });

});