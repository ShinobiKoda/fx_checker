async function run() {
  const fetch = global.fetch; // node 18+
  const todayObj = new Date();
  const prevObj = new Date();
  prevObj.setDate(todayObj.getDate() - 4);

  const today = todayObj.toISOString().split('T')[0];
  const prev = prevObj.toISOString().split('T')[0];

  const base = "USD";
  const [latestRes, prevRes] = await Promise.all([
    fetch(`https://api.frankfurter.dev/v2/rates/${today}?base=${base}`),
    fetch(`https://api.frankfurter.dev/v2/rates/${prev}?base=${base}`),
  ]);
  const latestData = await latestRes.json();
  const prevData = await prevRes.json();

  const prevMap = {};
  for (const item of prevData) {
    prevMap[item.quote] = item.rate;
  }
  const result = latestData.map((item) => {
    const prevRate = prevMap[item.quote];
    let change = 0;
    let direction = 'flat';

    if (prevRate !== undefined && prevRate !== 0) {
      change = ((item.rate - prevRate) / prevRate) * 100;
      if (change > 0.001) direction = 'up';
      else if (change < -0.001) direction = 'down';
    }

    return {
      ...item,
      change: parseFloat(change.toFixed(2)),
      direction,
    };
  });
  console.log(result.slice(0, 5));
}
run();
