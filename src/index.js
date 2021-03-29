const BOT = require('./vk')

const citgen = require('./citgen')
const Schedule = require('./schedule')

const Intl = require('intl')
const moment = require('moment')
const Time = new Date()
const formatter = new Intl.DateTimeFormat('ru', {
  month: 'long',
  day: 'numeric'
})

moment().format()

const hearCommand = (name, conditions, handle) => {
  if (typeof handle !== 'function') {
      handle = conditions;
      conditions = [`/${name}`];
  }

  if (!Array.isArray(conditions)) {
      conditions = [conditions];
  }

  BOT.MESSAGES.hear(
      [
          (text, {
              state
          }) => (
              state.command === name
          ),
          ...conditions
      ],
      handle
  );
};

// Cоздаем сервер
require('http').createServer().listen(process.env.PORT || 8000).on('request', function(request, res) {
  res.end('')
})

BOT.MESSAGES.hear('/start', async (context) => {
  await context.send(`Привет! 👋
🤖 Я - Бот, созданный специально для группы ${BOT.CONFIG.className} ${BOT.CONFIG.schoolName}. Я надеюсь, что буду очень полезен вам, и вы получите незабываемый опыт ☺️. Поскольку я могу многое, я привожу список основных моих команд:

/дата - узнай дз на конкретный день
———————————
/дз завтра - отправляет домашние задания на завтра
———————————
/игры - отправляет клавиатуру с выбором игр (да-да, не удивляйтесь)
———————————
/неделя - расписание на всю неделю
———————————
/шпора - добавляй важные фото/документы/шпоры, чтобы не искать потом по всей беседе
———————————
/команды - список ВСЕХ моих команд
———————————
/help - моя документация`)
})
BOT.MESSAGES.hear('/игры', async (context) => {
  const gamesKeyboard = BOT.KEYBOARD.keyboard([
      [
          BOT.KEYBOARD.textButton({
              label: 'Шар Вероятностей',
              payload: {
                  command: 'ball'
              },
              color: BOT.KEYBOARD.POSITIVE_COLOR
          }),
          BOT.KEYBOARD.textButton({
              label: 'Что-то еще...',
              payload: {
                  command: 'else'
              },
              color: BOT.KEYBOARD.POSITIVE_COLOR
          })
      ],
      BOT.KEYBOARD.textButton({
          label: 'Закрыть клавиатуру',
          payload: {
              command: 'cancel'
          },
          color: BOT.KEYBOARD.NEGATIVE_COLOR
      })
  ]).oneTime()

  await context.send({
      message: 'Вот список моих игр',
      keyboard: gamesKeyboard
  })
})

hearCommand('ball', async (context) => {
  await context.send(`Как играть в эту игру? Очень просто! Ты пишешь "шанc" и свое утверждение, а я отвечаю вероятностью.
Пример:

— Шанc, что мы - дружный класс.
— Вероятность - 100%`)

  BOT.MESSAGES.hear(/шанс/i, (context) => {
      const chances = new Array(6)
      chances[0] = 'Вероятность близка к нулю :('
      chances[1] = 'Я считаю, что 50 на 50'
      chances[2] = 'Вероятность - 100%'
      chances[3] = 'Я полагаю, что вероятность близка к 100%'
      chances[4] = 'Маловероятно, но шанс есть'
      chances[5] = 'Вероятность нулевая, ничего не поделать'

      context.send(chances[Math.floor(Math.random() * chances.length)])
  })
})

hearCommand('else', async (context) => {
  await context.send(`Раз эта кнопка у вас все еще есть, значит я страдаю от острой игровой недостаточности. Если у вас есть идеи, которые может реализовать этот бот в игровой форме - пишите ${BOT.CONFIG.adminNameDat}, он сможет :)`)
})

hearCommand('cancel', async (context) => {
  await context.send('Хорошо, я выключу клавиатуру!')
})


BOT.MESSAGES.hear('/завтра', async (context) => {
  for (i = 0; i < 7; i++) {
      if (moment().day() === i) {
          if (is11A === true) {
              await context.send(`Расписание на завтра: \n${Schedule[i].map(({a11}) => a11).join('')}`)
          } else {
              await context.send(`Расписание на завтра: \n${Schedule[i].map(({b11}) => b11).join('')}`)
          }
      }
  }
})

for (i = 0; i < 7; i++) {
  if (moment().day() === i && moment().hour() === 15 && moment().minute() === 30) {
      context.send('Домашка на завтра. Сегодня ' + formatter.format(Time) + '\n' + Days[i].join('\n'))
  }
}


BOT.MESSAGES.hear('/help', async (context) => {
  await context.send(`Итак, вот вам более-менее краткая документация.
Мой исходный код: https://github.com/sashafromlibertalia/SchoolBot

Краткая сводка по моим командам: /start

Ответы на те или иные сообщения вызваны регулярными выражениями. Как это работает? Просто! 
Я делаю триггер на то или иное слово, а бот на него отвечает.

КАК РАБОТАЕТ /гдз:
Вы пишите команду "/гдз" и следом текст задачи. Пример:
/гдз Из двух городов одновременно на встречу друг другу отправились два поезда. 

Со временем команды будут увеличиваться, если вы об этом меня попросите и если в этом будет вообще всякий смысл`)
})

BOT.MESSAGES.hear(/^\/отзыв (.+)/i, async (context) => {
  const feedback = context.$match[1]
  await context.send(`Хорошо, твой отзыв будет отправлен ${BOT.CONFIG.adminNameDat}, спасибо :)`)
  api.messages.send({
      message: 'НОВЫЙ ОТЗЫВ: ' + feedback,
      domain: BOT.CONFIG.adminDomain
  })
})

BOT.MESSAGES.hear('/неделя', async (context) => {
  if (is11A === true) {
      await context.send(`РАСПИСАНИЕ НА ВСЮ НЕДЕЛЮ:
ПОНЕДЕЛЬНИК:
${Schedule[0].map(({a11}) => a11).join('')}

ВТОРНИК:
${Schedule[1].map(({a11}) => a11).join('')}

СРЕДА:
${Schedule[2].map(({a11}) => a11).join('')}

ЧЕТВЕРГ:
${Schedule[3].map(({a11}) => a11).join('')}

ПЯТНИЦА:
${Schedule[4].map(({a11}) => a11).join('')}

СУББОТА:
${Schedule[5].map(({a11}) => a11).join('')}`)
  } else {
      await context.send(`РАСПИСАНИЕ НА ВСЮ НЕДЕЛЮ:
ПОНЕДЕЛЬНИК:
${Schedule[0].map(({b11}) => b11).join('')}

ВТОРНИК:
${Schedule[1].map(({b11}) => b11).join('')}

СРЕДА:
${Schedule[2].map(({b11}) => b11).join('')}

ЧЕТВЕРГ:
${Schedule[3].map(({b11}) => b11).join('')}

ПЯТНИЦА:
${Schedule[4].map(({b11}) => b11).join('')}

СУББОТА:
${Schedule[5].map(({b11}) => b11).join('')}`)
  }
})


BOT.VK.updates.start().catch(console.error);