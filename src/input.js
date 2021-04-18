import moment from 'moment';

const inputText = `Budget History:
01.01.2019: First budget 7 (10:00), 0 (11:00), 1 (12:00), 6 (23:00); 
01.05.2019: 2 (10:00);
01.06.2019: 0 (00:00);
02.09.2019: 1 (13:13);
03.01.2019: 0 (12:00), 1 (14:00)
`

const budgetInput = [
    {
        date: moment({ year: 2019, month: 0, day: 1, hour: 0, minute: 0}),
        budgets: [
            {
                amount: 7,
                time: moment({ year: 2019, month: 0, day: 1, hour: 10, minute: 0 })
            },
            {
                amount: 0,
                time: moment({ year: 2019, month: 0, day: 1, hour: 11, minute: 0 })
            },
            {
                amount: 1,
                time: moment({ year: 2019, month: 0, day: 1, hour: 12, minute: 0 })
            },
            {
                amount: 6,
                time: moment({ year: 2019, month: 0, day: 1, hour: 23, minute: 0 })
            },
        ]
    },
    {
        date: moment({ year: 2019, month: 0, day: 5, hour: 0, minute: 0 }),
        budgets: [
            {
                amount: 1,
                time: moment({ year: 2019, month: 0, day: 5, hour: 13, minute: 13 })
            },
        ]
    },
    {
        date: moment({ year: 2019, month: 0, day: 6, hour: 0, minute: 0 }),
        budgets: [
            {
                amount: 0,
                time: moment({ year: 2019, month: 0, day: 6, hour: 0, minute: 0 })
            },
        ]
    },
    {
        date: moment({ year: 2019, month: 1, day: 9, hour: 0, minute: 0 }),
        budgets: [
            {
                amount: 2,
                time: moment({ year: 2019, month: 1, day: 9, hour: 10, minute: 0 })
            },
        ]
    },
    {
        date: moment({ year: 2019, month: 2, day: 1, hour: 0, minute: 0 }),
        budgets: [
            {
                amount: 0,
                time: moment({ year: 2019, month: 2, day: 1, hour: 12, minute: 0 })
            },
            {
                amount: 1,
                time: moment({ year: 2019, month: 2, day: 1, hour: 14, minute: 0 })
            }
        ]
    }
];

export { budgetInput, inputText };