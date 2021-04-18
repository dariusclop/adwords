import { inputText, budgetInput }  from './input';
import { InputDiv } from './App.styles';
import moment from 'moment';
import { chain } from 'lodash';

let inputLines = inputText.split(/\n/);
const costsGenerated = [];
const budgetMultiplier = 2;
const maxCostsGeneratedPerDay = 10;

const App = () => {
  const displayInput = () => {
    return inputLines.map((line, index) => <p key={`line-${index}`}>{line}</p>)
  };

  const compareDates = (firstDate, secondDate) => {
    return moment(firstDate.format('YYYY-MM-DD')).isBefore(secondDate.format('YYYY-MM-DD'))
  };

  const equalDates = (firstDate, secondDate) => {
    return moment(firstDate.format('YYYY-MM-DD')).isSame(secondDate.format('YYYY-MM-DD'))
  }

  const getDailyMaximumBudgets = () => {
    return budgetInput.map(budgetEntries => {
      let maximumBudget = 0;
      let dailyBudgets = {};
      budgetEntries.budgets.forEach(budgets => {
        if(maximumBudget < budgets?.amount) {
          maximumBudget = budgets.amount;
        }
        dailyBudgets = {...budgetEntries, maximumBudget, latestBudget: budgets?.amount}
      });
      return Object.keys(dailyBudgets).length ? dailyBudgets : budgetEntries;
    })
  };

  const getBudgetsByMonth = budgets => {
    return chain(budgets)
						.groupBy(budget =>  {
              return budget.date.month() + '.' + budget.date.year();
						})
						.map((value, key) => ({ month: key, items: value }))
						.value();
  }

  const getMonthlyMaxBudgets = monthlyBudgets => {
    return monthlyBudgets.map(monthlyBudget => {
      let monthlyMaxCost = 0;
      let dailyCost = 0;
      const monthlyBudgetDate = monthlyBudget.month.split('.');
      const currentDate = moment({ year: parseInt(monthlyBudgetDate[1]), month: parseInt(monthlyBudgetDate[0]), day: 1, hour: 0, minute: 0});
      const endDate = currentDate.clone().add(1, 'months');
      while(compareDates(currentDate, endDate)) {
        let foundDate = false;

        for(let dailyBudget of monthlyBudget.items) {
          if(equalDates(dailyBudget.date, currentDate)) {
            monthlyMaxCost += dailyBudget.maximumBudget;
            dailyCost = dailyBudget.latestBudget;
            foundDate = true;
            break;
          }

          if(!foundDate) {
            monthlyMaxCost += dailyCost;
          }
        }
        currentDate.add(1, 'days');
      }
      return {
        ...monthlyBudget,
        monthlyMaxCost
      }
    })
  }

  const getAllBudgets = dailyBudgets => {
    const budgets = [];
    dailyBudgets.forEach(item => {
      for(let budget of item.budgets) {
        const budgetItem = {
          ...budget,
          maximumBudget: item.maximumBudget
        }
        budgets.push(budgetItem);
      }
    });
    return budgets;
  }
  
  const calculateBudget = () => {
    const dailyBudgets = getDailyMaximumBudgets();
    const monthlyBudgets = getBudgetsByMonth(dailyBudgets);
    const monthlyMaxBudgets = getMonthlyMaxBudgets(monthlyBudgets);
    const allBudgets = getAllBudgets(dailyBudgets);

    monthlyMaxBudgets.forEach(monthlyBudget => {
      const monthlyBudgetDate = monthlyBudget.month.split('.');
      const currentDate = moment({ year: parseInt(monthlyBudgetDate[1]), month: parseInt(monthlyBudgetDate[0]), day: 1, hour: 0, minute: 0});
      const clonedCurrentDate = currentDate.clone();
      const endDate = clonedCurrentDate.add(1, 'months');
      let monthBudgetTotal = monthlyBudget.monthlyMaxCost;
      let spentMonthBudgetTotal = 0;

      while(compareDates(currentDate, endDate)) {
        let dailyCost = 0;
        let dailyMaximumBudget = 0;
        let numberOfGeneratedCosts = Math.floor(Math.random() * maxCostsGeneratedPerDay + 1);

        for(let i = 0; i < numberOfGeneratedCosts; i++) {
          let getDailyBudget = 0;
          let newCostDate = currentDate.clone().hour(Math.floor(Math.random() * 24)).minute(Math.floor(Math.random() * 60)).seconds(0);

          const dailyBudget = allBudgets.filter(budget => compareDates(budget.time, newCostDate));
          if(dailyBudget.length !== 0) {
            const budgetItem = dailyBudget[dailyBudget.length - 1];
            getDailyBudget = budgetItem.amount;
            dailyMaximumBudget = budgetItem.maximumBudget;
          }
          if(getDailyBudget === 0) {
            continue;
          }

          let generatedRandomCost = parseFloat((Math.random() * getDailyBudget).toFixed(2));
          if((generatedRandomCost + dailyCost <= getDailyBudget * budgetMultiplier) && (generatedRandomCost + spentMonthBudgetTotal) <= monthBudgetTotal) {
            dailyCost += generatedRandomCost;
            spentMonthBudgetTotal += generatedRandomCost;
            costsGenerated.push({ date: newCostDate, generatedCost: generatedRandomCost, getDailyBudget, dailyMaximumBudget});
          }
        }
        currentDate.add(1, 'days');
      }
    })
  }

  return (
    <div>
      <h1>Web Recruitment App</h1>
      <InputDiv>
        <h3>Input</h3>
        {displayInput()}
      </InputDiv>
      <div>
        <button style={{width: '200px', height: '48px'}} onClick={() => calculateBudget()}>See budgets</button>
      </div>
    </div>
  );
}

export default App;
