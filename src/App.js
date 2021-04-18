import { inputText, budgetInput }  from './input';
import { InputDiv } from './App.styles';
import moment from 'moment';
import { chain } from 'lodash';

let inputLines = inputText.split(/\n/);
const initialBudget = budgetInput[0]?.budgets[0]?.amount;
const startDate = budgetInput[0]?.date;
const clonedStartDate = startDate.clone();
const endDate = clonedStartDate.add(3, 'months');
let monthlyBudget = 0; 
const costsGenerated = [];
const dailyHistory = [];
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
    return monthlyBudgets.map((monthlyBudget, index) => {
      let monthlyMaxCost = 0;
      let dailyCost = 0;
      const monthlyBudgetDate = monthlyBudget.month.split('.');
      const startDate = moment({ year: monthlyBudgetDate[1], month: monthlyBudgetDate[0], day: 1, hour: 0, minute: 0});
      const endDate = startDate.clone().add(1, 'months');
      while(compareDates(startDate, endDate)) {
        let foundDate = false;
        for(let dailyBudget of monthlyBudget.items) {
          if(equalDates(dailyBudget.date, startDate)) {
            monthlyMaxCost += dailyBudget.maximumBudget;
            dailyCost = dailyBudget.latestBudget;
            foundDate = true;
            break;
          }

          if(!foundDate) {
            monthlyMaxCost += dailyCost;
          }
        }
        startDate.add(1, 'days');
      }
      return {
        ...monthlyBudget,
        monthlyMaxCost
      }
    })
  }
  
  const calculateBudget = () => {
    const dailyBudgets = getDailyMaximumBudgets();
    const monthlyBudgets = getBudgetsByMonth(dailyBudgets);
    const monthlyMaxBudgets = getMonthlyMaxBudgets(monthlyBudgets);
    console.log(monthlyMaxBudgets);
    dailyBudgets.forEach((budget, index) => {
      let currentDate = budget.date.clone();
      if(budgetInput[index + 1]) {
        while(compareDates(currentDate, budgetInput[index + 1].date)) {
          currentDate.add(1, 'days');
        }
      } else {
        while(compareDates(currentDate, endDate)) {
          currentDate.add(1, 'days');
        }
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
        <button style={{width: '200px', height: '48px'}} onClick={() => calculateBudget()}>See budget</button>
      </div>
    </div>
  );
}

export default App;
