import { useState, useCallback, useMemo, useRef, CSSProperties } from "react";

import coinSound from "../assets/coinsound.wav";

import sticksound from "../assets/sticksound.wav";


// I Ching hexagram data - all 64 hexagrams (trilingual)
const hexagrams = {
  1: {
    en: {
      name: "The Creative",
      interpretation: "Powerful forces are at work. Success comes through persistence and strength of character."
    },
    ru: {
      name: "Творчество",
      interpretation: "Действуют мощные силы. Успех приходит через настойчивость и силу характера."
    },
    zh: {
      name: "乾",
      interpretation: "干元亨利贞"
    }
  },
  2: {
    en: {
      name: "The Receptive",
      interpretation: "Yield to circumstances and remain open. Success comes through acceptance and devotion."
    },
    ru: {
      name: "Восприимчивость",
      interpretation: "Уступай обстоятельствам и оставайся открытым. Успех приходит через принятие и преданность."
    },
    zh: {
      name: "坤",
      interpretation: "坤 元 亨 利牝马之贞 君子有攸往 先迷后得主 利 西南得朋 东北丧朋 安贞吉"
    }
  },
  3: {
    en: {
      name: "Difficulty at the Beginning",
      interpretation: "Initial obstacles require patience. Do not force progress; build foundations carefully."
    },
    ru: {
      name: "Трудность в начале",
      interpretation: "Первые препятствия требуют терпения. Не форсируй продвижение; тщательно закладывай основу."
    },
    zh: {
      name: "屯",
      interpretation: "屯 元亨 利贞 勿用有攸往 利建侯"
    }
  },
  4: {
    en: {
      name: "Youthful Folly",
      interpretation: "Learning and guidance are needed. Seek wisdom from those with experience."
    },
    ru: {
      name: "Юношеская неопытность",
      interpretation: "Нужны обучение и наставление. Ищи мудрость у тех, кто опытнее."
    },
    zh: {
      name: "蒙",
      interpretation: "蒙 亨 匪我求童蒙 童蒙求我 初噬告 再三渎 渎则不告 利贞"
    }
  },
  5: {
    en: {
      name: "Waiting",
      interpretation: "Patience brings success. Wait for the right moment before taking action."
    },
    ru: {
      name: "Ожидание",
      interpretation: "Терпение приносит успех. Дождись подходящего момента, прежде чем действовать."
    },
    zh: {
      name: "需",
      interpretation: "需 有孚 光亨 贞吉 利涉大川"
    }
  },
  6: {
    en: {
      name: "Conflict",
      interpretation: "Arguments and disputes arise. Seek compromise rather than confrontation."
    },
    ru: {
      name: "Конфликт",
      interpretation: "Возникают споры и разногласия. Ищи компромисс, а не столкновение."
    },
    zh: {
      name: "讼",
      interpretation: "讼 有孚 窒惕 中吉 终凶 利见大人 不利涉大川"
    }
  },
  7: {
    en: {
      name: "The Army",
      interpretation: "Discipline and organization are required. Leadership must be strong and just."
    },
    ru: {
      name: "Войско",
      interpretation: "Нужны дисциплина и порядок. Руководство должно быть сильным и справедливым."
    },
    zh: {
      name: "师",
      interpretation: "师 贞 丈人 吉无咎"
    }
  },
  8: {
    en: {
      name: "Holding Together",
      interpretation: "Unity and cooperation bring strength. Build alliances and foster harmony."
    },
    ru: {
      name: "Единение",
      interpretation: "Единство и сотрудничество дают силу. Создавай союзы и поддерживай гармонию."
    },
    zh: {
      name: "比",
      interpretation: "比 吉 原筮元永贞 无咎 不宁方来 后夫凶"
    }
  },
  9: {
    en: {
      name: "Small Taming",
      interpretation: "Minor restraints slow progress. Accept limitations and work within them."
    },
    ru: {
      name: "Малая сдерживающая сила",
      interpretation: "Небольшие ограничения замедляют движение. Прими рамки и действуй внутри них."
    },
    zh: {
      name: "小畜",
      interpretation: "小畜 亨 密云不雨 自我西郊"
    }
  },
  10: {
    en: {
      name: "Treading",
      interpretation: "Proceed carefully on dangerous ground. Courtesy and caution ensure safety."
    },
    ru: {
      name: "Ступание",
      interpretation: "Иди осторожно по опасной почве. Вежливость и осмотрительность дают безопасность."
    },
    zh: {
      name: "履",
      interpretation: "履 履虎尾 不咥人 亨"
    }
  },
  11: {
    en: {
      name: "Peace",
      interpretation: "Harmony and prosperity prevail. This is a favorable time for all endeavors."
    },
    ru: {
      name: "Мир",
      interpretation: "Гармония и благополучие преобладают. Благоприятное время для дел и начинаний."
    },
    zh: {
      name: "泰",
      interpretation: "泰 小往大来 吉亨"
    }
  },
  12: {
    en: {
      name: "Standstill",
      interpretation: "Stagnation and obstacles block the way. Retreat and wait for better times."
    },
    ru: {
      name: "Застой",
      interpretation: "Застой и препятствия перекрывают путь. Отступи и дождись лучших времён."
    },
    zh: {
      name: "否",
      interpretation: "否之匪人 不利君子贞 大往小来"
    }
  },
  13: {
    en: {
      name: "Fellowship",
      interpretation: "Community and shared goals create strength. Seek like-minded companions."
    },
    ru: {
      name: "Единомышленники",
      interpretation: "Общность и общие цели дают силу. Ищи тех, кто разделяет твой путь."
    },
    zh: {
      name: "同人",
      interpretation: "同人 同人于野 亨 利涉大川 利君子贞"
    }
  },
  14: {
    en: {
      name: "Great Possession",
      interpretation: "Abundance and success are yours. Share your fortune with others."
    },
    ru: {
      name: "Великое обладание",
      interpretation: "Изобилие и успех на твоей стороне. Делись благом с другими."
    },
    zh: {
      name: "大有",
      interpretation: "大有 元亨"
    }
  },
  15: {
    en: {
      name: "Modesty",
      interpretation: "Humility brings respect and success. Do not boast of your achievements."
    },
    ru: {
      name: "Скромность",
      interpretation: "Скромность приносит уважение и успех. Не выставляй достижения напоказ."
    },
    zh: {
      name: "谦",
      interpretation: "谦 亨 君子有终"
    }
  },
  16: {
    en: {
      name: "Enthusiasm",
      interpretation: "Joy and inspiration motivate action. Share your energy with others."
    },
    ru: {
      name: "Воодушевление",
      interpretation: "Радость и вдохновение побуждают действовать. Делись энергией с другими."
    },
    zh: {
      name: "豫",
      interpretation: "豫 利建侯行师"
    }
  },
  17: {
    en: {
      name: "Following",
      interpretation: "Adapt to circumstances and follow the natural flow. Leadership emerges from flexibility."
    },
    ru: {
      name: "Следование",
      interpretation: "Приспосабливайся к обстоятельствам и следуй естественному ходу. Лидерство рождается из гибкости."
    },
    zh: {
      name: "随",
      interpretation: "随 元亨利贞 无咎"
    }
  },
  18: {
    en: {
      name: "Work on the Decayed",
      interpretation: "Corruption must be addressed. Clean up old problems before moving forward."
    },
    ru: {
      name: "Исправление порчи",
      interpretation: "Нужно заняться разложением и ошибками. Разберись со старым, прежде чем идти дальше."
    },
    zh: {
      name: "蛊",
      interpretation: "蛊 元亨 利涉大川 先甲三日 后甲三日"
    }
  },
  19: {
    en: {
      name: "Approach",
      interpretation: "Opportunity draws near. Prepare yourself to receive good fortune."
    },
    ru: {
      name: "Приближение",
      interpretation: "Возможность приближается. Подготовься принять удачу и хорошие перемены."
    },
    zh: {
      name: "临",
      interpretation: "临 元亨利贞 至于八月有凶"
    }
  },
  20: {
    en: {
      name: "Contemplation",
      interpretation: "Observe before acting. Understanding comes through reflection and patience."
    },
    ru: {
      name: "Созерцание",
      interpretation: "Наблюдай прежде, чем действовать. Понимание приходит через размышление и терпение."
    },
    zh: {
      name: "观",
      interpretation: "观 盥而不荐 有孚颙若"
    }
  },
  21: {
    en: {
      name: "Biting Through",
      interpretation: "Obstacles must be removed decisively. Justice and clarity are needed."
    },
    ru: {
      name: "Разгрызание преграды",
      interpretation: "Препятствия нужно убрать решительно. Нужны ясность и справедливость."
    },
    zh: {
      name: "噬嗑",
      interpretation: "噬嗑 亨 利用狱"
    }
  },
  22: {
    en: {
      name: "Grace",
      interpretation: "Beauty and form matter. Pay attention to appearance and presentation."
    },
    ru: {
      name: "Благолепие",
      interpretation: "Красота и форма имеют значение. Удели внимание внешнему виду и подаче."
    },
    zh: {
      name: "贲",
      interpretation: "贲 亨 小利有所往"
    }
  },
  23: {
    en: {
      name: "Splitting Apart",
      interpretation: "Deterioration is occurring. Accept losses and prepare for renewal."
    },
    ru: {
      name: "Разрушение",
      interpretation: "Идёт распад и ухудшение. Прими потери и готовься к обновлению."
    },
    zh: {
      name: "剥",
      interpretation: "剥 不利有攸往 "
    }
  },
  24: {
    en: {
      name: "Return",
      interpretation: "A turning point arrives. New beginnings emerge from endings."
    },
    ru: {
      name: "Возвращение",
      interpretation: "Наступает поворотный момент. Новое начинается после завершения старого."
    },
    zh: {
      name: "复",
      interpretation: "复 亨 出入无疾 朋来无咎 反复其道 七日来复 利有攸往"
    }
  },
  25: {
    en: {
      name: "Innocence",
      interpretation: "Act with sincerity and spontaneity. Avoid calculation and manipulation."
    },
    ru: {
      name: "Невинность",
      interpretation: "Действуй искренне и просто. Избегай расчёта и манипуляций."
    },
    zh: {
      name: "无妄",
      interpretation: "无妄 元亨利贞 其匪正有眚 不利有攸往"
    }
  },
  26: {
    en: {
      name: "Great Taming",
      interpretation: "Accumulated strength brings power. Use your resources wisely."
    },
    ru: {
      name: "Великая сдерживающая сила",
      interpretation: "Накопленная сила даёт власть. Пользуйся ресурсами разумно."
    },
    zh: {
      name: "大畜",
      interpretation: "大畜 利贞 不家食吉 利涉大川"
    }
  },
  27: {
    en: {
      name: "Nourishment",
      interpretation: "Careful attention to sustenance is needed. Feed what is worthy."
    },
    ru: {
      name: "Питание",
      interpretation: "Нужна внимательность к тому, что поддерживает жизнь. Питай то, что достойно."
    },
    zh: {
      name: "颐",
      interpretation: "颐 贞吉 观颐 自求口实"
    }
  },
  28: {
    en: {
      name: "Great Exceeding",
      interpretation: "Exceptional pressure requires extraordinary measures. Bold action is needed."
    },
    ru: {
      name: "Великое превышение",
      interpretation: "Необычное давление требует необычных мер. Нужна смелая решимость."
    },
    zh: {
      name: "大过",
      interpretation: "大过 栋桡 利有攸往 亨"
    }
  },
  29: {
    en: {
      name: "The Abysmal",
      interpretation: "Danger surrounds you. Maintain your integrity and persevere."
    },
    ru: {
      name: "Бездна",
      interpretation: "Опасность рядом. Сохраняй целостность и продолжай путь."
    },
    zh: {
      name: "坎",
      interpretation: "坎 习坎 有孚 维心亨 行有尚"
    }
  },
  30: {
    en: {
      name: "The Clinging",
      interpretation: "Clarity and awareness illuminate the path. Remain conscious and alert."
    },
    ru: {
      name: "Сияние",
      interpretation: "Ясность и осознанность освещают путь. Оставайся внимательным и собранным."
    },
    zh: {
      name: "离",
      interpretation: "离 利贞 亨 畜牝牛 吉"
    }
  },
  31: {
    en: {
      name: "Influence",
      interpretation: "Attraction and receptivity create connections. Remain open to others."
    },
    ru: {
      name: "Влияние",
      interpretation: "Притяжение и открытость создают связь. Оставайся восприимчивым к людям."
    },
    zh: {
      name: "咸",
      interpretation: "咸 亨 利贞 取女吉"
    }
  },
  32: {
    en: {
      name: "Duration",
      interpretation: "Consistency and endurance bring lasting results. Maintain your course."
    },
    ru: {
      name: "Постоянство",
      interpretation: "Последовательность и выносливость дают устойчивый результат. Держи выбранный курс."
    },
    zh: {
      name: "恒",
      interpretation: "恒 亨 无咎 利贞 利有攸往"
    }
  },
  33: {
    en: {
      name: "Retreat",
      interpretation: "Withdrawal is strategic. Preserve your strength for a better time."
    },
    ru: {
      name: "Отступление",
      interpretation: "Отход может быть стратегией. Сбереги силы для лучшего времени."
    },
    zh: {
      name: "遁",
      interpretation: "遁 亨 小利贞"
    }
  },
  34: {
    en: {
      name: "Great Power",
      interpretation: "Strength must be used with righteousness. Power requires responsibility."
    },
    ru: {
      name: "Великая сила",
      interpretation: "Силу нужно применять по правоте. Власть требует ответственности."
    },
    zh: {
      name: "大壮",
      interpretation: "大壮 利贞"
    }
  },
  35: {
    en: {
      name: "Progress",
      interpretation: "Advancement and recognition come. Accept success with grace."
    },
    ru: {
      name: "Продвижение",
      interpretation: "Приходят рост и признание. Прими успех спокойно и достойно."
    },
    zh: {
      name: "晋",
      interpretation: "晋 康侯用锡马蕃庶 昼日三接"
    }
  },
  36: {
    en: {
      name: "Darkening of the Light",
      interpretation: "Adversity tests your character. Preserve your inner light through darkness."
    },
    ru: {
      name: "Затмение света",
      interpretation: "Трудности испытывают характер. Сохрани внутренний свет в темноте."
    },
    zh: {
      name: "明夷",
      interpretation: "明夷 利艰贞 "
    }
  },
  37: {
    en: {
      name: "The Family",
      interpretation: "Order begins at home. Cultivate harmony in close relationships."
    },
    ru: {
      name: "Семья",
      interpretation: "Порядок начинается дома. Укрепляй гармонию в близких отношениях."
    },
    zh: {
      name: "家人",
      interpretation: "家人 利女贞"
    }
  },
  38: {
    en: {
      name: "Opposition",
      interpretation: "Differences must be respected. Unity comes from accepting diversity."
    },
    ru: {
      name: "Противостояние",
      interpretation: "Различия нужно уважать. Единство приходит через принятие разнообразия."
    },
    zh: {
      name: "睽",
      interpretation: "睽 小事吉"
    }
  },
  39: {
    en: {
      name: "Obstruction",
      interpretation: "Difficulties block your path. Seek help and proceed cautiously."
    },
    ru: {
      name: "Препятствие",
      interpretation: "Трудности перекрывают путь. Ищи помощь и действуй осторожно."
    },
    zh: {
      name: "蹇",
      interpretation: "蹇 利西南 不利东北 利见大人 贞吉"
    }
  },
  40: {
    en: {
      name: "Deliverance",
      interpretation: "Release from tension arrives. Forgive and let go of past burdens."
    },
    ru: {
      name: "Освобождение",
      interpretation: "Приходит разрядка. Прости и отпусти прошлые тяжести."
    },
    zh: {
      name: "解",
      interpretation: "解 利西南 无所往 其来复吉 有攸往 夙吉"
    }
  },
  41: {
    en: {
      name: "Decrease",
      interpretation: "Simplification is beneficial. Let go of excess to gain clarity."
    },
    ru: {
      name: "Уменьшение",
      interpretation: "Упрощение полезно. Отпусти лишнее, чтобы обрести ясность."
    },
    zh: {
      name: "损",
      interpretation: "损 有孚 元吉 无咎 可贞 利有攸往 曷之用 二簋可用享"
    }
  },
  42: {
    en: {
      name: "Increase",
      interpretation: "Growth and expansion are favored. Seize opportunities for advancement."
    },
    ru: {
      name: "Увеличение",
      interpretation: "Рост и расширение поддержаны. Используй возможности для продвижения."
    },
    zh: {
      name: "益",
      interpretation: "益 利有攸往 利涉大川"
    }
  },
  43: {
    en: {
      name: "Breakthrough",
      interpretation: "Decisive action removes obstacles. Address problems directly."
    },
    ru: {
      name: "Прорыв",
      interpretation: "Решительное действие убирает преграды. Разбирайся с проблемами напрямую."
    },
    zh: {
      name: "夬",
      interpretation: "夬 扬于王庭 孚号 有厉 告自邑 不利即戎 利有攸往"
    }
  },
  44: {
    en: {
      name: "Coming to Meet",
      interpretation: "Unexpected encounters arise. Be aware of hidden influences."
    },
    ru: {
      name: "Встреча",
      interpretation: "Возникают неожиданные встречи. Будь внимателен к скрытым влияниям."
    },
    zh: {
      name: "姤",
      interpretation: "姤 女壮 勿用取女"
    }
  },
  45: {
    en: {
      name: "Gathering Together",
      interpretation: "Unity creates strength. Assemble resources and allies."
    },
    ru: {
      name: "Собрание",
      interpretation: "Единство даёт силу. Собери ресурсы и союзников."
    },
    zh: {
      name: "萃",
      interpretation: "萃 亨 王假有庙 利见大人 亨 利贞 用大牲吉 利有攸往"
    }
  },
  46: {
    en: {
      name: "Pushing Upward",
      interpretation: "Gradual advancement is steady. Build success step by step."
    },
    ru: {
      name: "Подъём",
      interpretation: "Постепенное продвижение устойчиво. Строй успех шаг за шагом."
    },
    zh: {
      name: "升",
      interpretation: "升 元亨 用见大人 勿恤 南征吉"
    }
  },
  47: {
    en: {
      name: "Oppression",
      interpretation: "Exhaustion tests your resolve. Conserve energy and wait."
    },
    ru: {
      name: "Истощение",
      interpretation: "Усталость испытывает решимость. Береги силы и выжди."
    },
    zh: {
      name: "困",
      interpretation: "困 亨 贞 大人吉 无咎 有言不信"
    }
  },
  48: {
    en: {
      name: "The Well",
      interpretation: "Inexhaustible resources sustain life. Return to fundamental sources."
    },
    ru: {
      name: "Колодец",
      interpretation: "Неиссякаемые ресурсы поддерживают жизнь. Возвращайся к истокам."
    },
    zh: {
      name: "井",
      interpretation: "井 改邑不改井 无丧无得 往来井井 汔至 亦未繘井 羸其瓶 凶"
    }
  },
  49: {
    en: {
      name: "Revolution",
      interpretation: "Transformation is necessary. Change outdated systems and beliefs."
    },
    ru: {
      name: "Перемена",
      interpretation: "Нужна трансформация. Меняй устаревшие системы и убеждения."
    },
    zh: {
      name: "革",
      interpretation: "革 巳日乃孚 元亨利贞 悔亡"
    }
  },
  50: {
    en: {
      name: "The Cauldron",
      interpretation: "Refinement and nourishment. Cultivate what is valuable and worthy."
    },
    ru: {
      name: "Котёл",
      interpretation: "Очищение и питание. Развивай то, что ценно и достойно."
    },
    zh: {
      name: "鼎",
      interpretation: "鼎 元吉 亨"
    }
  },
  51: {
    en: {
      name: "The Arousing",
      interpretation: "Shock and sudden change. Remain centered during upheaval."
    },
    ru: {
      name: "Гром",
      interpretation: "Потрясение и резкая перемена. Сохраняй центр в смятении."
    },
    zh: {
      name: "震",
      interpretation: "震 亨 震来虩虩 笑言哑哑 震惊百里 不丧匕鬯"
    }
  },
  52: {
    en: {
      name: "Keeping Still",
      interpretation: "Stillness brings clarity. Rest and reflect before proceeding."
    },
    ru: {
      name: "Неподвижность",
      interpretation: "Покой приносит ясность. Отдохни и обдумай, прежде чем идти дальше."
    },
    zh: {
      name: "艮",
      interpretation: "艮 艮其背 不获其身 行其庭 不见其人 无咎"
    }
  },
  53: {
    en: {
      name: "Development",
      interpretation: "Gradual progress unfolds naturally. Allow growth to happen organically."
    },
    ru: {
      name: "Постепенное развитие",
      interpretation: "Постепенный рост разворачивается естественно. Позволь развитию идти органично."
    },
    zh: {
      name: "渐",
      interpretation: "渐 女归吉 利贞"
    }
  },
  54: {
    en: {
      name: "The Marrying Maiden",
      interpretation: "Subordination to circumstances. Accept your current position gracefully."
    },
    ru: {
      name: "Выходящая замуж девушка",
      interpretation: "Подчинение обстоятельствам. Прими своё нынешнее положение достойно."
    },
    zh: {
      name: "归妹",
      interpretation: "归妹 征凶 无攸利"
    }
  },
  55: {
    en: {
      name: "Abundance",
      interpretation: "Peak of fullness and prosperity. Enjoy success while preparing for change."
    },
    ru: {
      name: "Изобилие",
      interpretation: "Пик полноты и достатка. Наслаждайся успехом, готовясь к переменам."
    },
    zh: {
      name: "丰",
      interpretation: "丰 亨 王假之 勿忧 宜日中"
    }
  },
  56: {
    en: {
      name: "The Wanderer",
      interpretation: "Temporary situations require adaptability. Travel light and stay flexible."
    },
    ru: {
      name: "Странник",
      interpretation: "Временные обстоятельства требуют гибкости. Иди налегке и оставайся подвижным."
    },
    zh: {
      name: "旅",
      interpretation: "旅 小亨 旅贞吉"
    }
  },
  57: {
    en: {
      name: "The Gentle",
      interpretation: "Subtle influence brings results. Work patiently and persistently."
    },
    ru: {
      name: "Проникновение",
      interpretation: "Тонкое влияние приносит результат. Работай терпеливо и настойчиво."
    },
    zh: {
      name: "巽",
      interpretation: "巽 小亨 利有攸往 利见大人"
    }
  },
  58: {
    en: {
      name: "The Joyous",
      interpretation: "Cheerfulness and pleasure. Share joy and cultivate positive relationships."
    },
    ru: {
      name: "Радость",
      interpretation: "Лёгкость и удовольствие. Делись радостью и укрепляй хорошие отношения."
    },
    zh: {
      name: "兑",
      interpretation: "兑 亨 利贞"
    }
  },
  59: {
    en: {
      name: "Dispersion",
      interpretation: "Dissolution of barriers. Breaking up rigidity allows new flow."
    },
    ru: {
      name: "Рассеяние",
      interpretation: "Растворяются барьеры. Ослабление жёсткости открывает новый поток."
    },
    zh: {
      name: "涣",
      interpretation: "涣 亨 王假有庙 利涉大川 利贞"
    }
  },
  60: {
    en: {
      name: "Limitation",
      interpretation: "Boundaries provide structure. Accept necessary restrictions gracefully."
    },
    ru: {
      name: "Ограничение",
      interpretation: "Границы дают структуру. Прими необходимые ограничения спокойно."
    },
    zh: {
      name: "节",
      interpretation: "节 亨 苦节不可贞"
    }
  },
  61: {
    en: {
      name: "Inner Truth",
      interpretation: "Sincerity and honesty prevail. Speak from the heart."
    },
    ru: {
      name: "Внутренняя правда",
      interpretation: "Искренность и честность преобладают. Говори от сердца."
    },
    zh: {
      name: "中孚",
      interpretation: "中孚 豚鱼吉 利涉大川 利贞"
    }
  },
  62: {
    en: {
      name: "Small Exceeding",
      interpretation: "Attention to details matters. Handle small matters with care."
    },
    ru: {
      name: "Малое превышение",
      interpretation: "Важны детали. Разбирайся с малым внимательно и бережно."
    },
    zh: {
      name: "小过",
      interpretation: "小过 亨 利贞 可小事不可大事 飞鸟遗之音 不宜上宜下 大吉"
    }
  },
  63: {
    en: {
      name: "After Completion",
      interpretation: "Success is achieved but requires vigilance. Maintain what you have gained."
    },
    ru: {
      name: "После завершения",
      interpretation: "Успех достигнут, но нужна бдительность. Сохрани то, что получил."
    },
    zh: {
      name: "既济",
      interpretation: "既济 亨 小利贞 初吉终乱"
    }
  },
  64: {
    en: {
      name: "Before Completion",
      interpretation: "Nearly finished but not yet complete. One final push brings success."
    },
    ru: {
      name: "Перед завершением",
      interpretation: "Почти готово, но ещё не завершено. Последний рывок приносит успех."
    },
    zh: {
      name: "未济",
      interpretation: "未济 亨 小狐汔济 濡其尾 无攸利"
    }
  }
};


// Convert binary array to hexagram number (1-64)
const binaryToHexagram = (lines: number[]): number => {
  // I Ching ordering: each trigram (3 lines) has a value
  // Bottom trigram (lines 0-2) and top trigram (lines 3-5)
  const trigramValues: {
    [key: string]: number;
  } = {
    "111": 0,
    "110": 1,
    "101": 2,
    "100": 3,
    "011": 4,
    "010": 5,
    "001": 6,
    "000": 7
  };
  const lower = lines.slice(0, 3).join("");
  const upper = lines.slice(3, 6).join("");
  const lowerValue = trigramValues[lower];
  const upperValue = trigramValues[upper];

  // King Wen sequence lookup table
  const kingWenSequence = [[1, 34, 5, 26, 11, 9, 14, 43], [25, 51, 3, 27, 24, 42, 21, 17], [6, 40, 29, 4, 7, 59, 64, 47], [33, 62, 39, 52, 15, 53, 56, 31], [12, 16, 8, 23, 2, 20, 35, 45], [44, 32, 48, 18, 46, 57, 50, 28], [13, 55, 63, 22, 36, 37, 30, 49], [10, 54, 60, 41, 19, 61, 38, 58]];
  return kingWenSequence[upperValue][lowerValue];
};

// Generate random hexagram
const generateHexagram = (): {
  lines: number[];
  number: number;
} => {
  const lines = Array.from({
    length: 6
  }, () => Math.round(Math.random()));
  const number = binaryToHexagram(lines);
  return {
    lines,
    number
  };
};
type Language = 'en' | 'ru' | 'zh';

interface TitleData {
  key: Language;
  label: string;
  title: string;
}

const titles: Record<Language, TitleData> = {
  en: { key: 'en', label: 'EN', title: 'I Ching Personal Oracle' },
  ru: { key: 'ru', label: 'RU', title: 'И Цзин онлайн' },
  zh: { key: 'zh', label: 'ZH', title: '易经  个人神谕' },
};

const Index = () => {
  const [result, setResult] = useState<{ lines: number[]; number: number } | null>(null);
  const [displayedResult, setDisplayedResult] = useState<{ lines: number[]; number: number } | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [languageOrder, setLanguageOrder] = useState<Language[]>(['en', 'ru', 'zh']);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayedLanguage, setDisplayedLanguage] = useState<Language>('en');
  const [isWiping, setIsWiping] = useState(false);
  const [isWipeIn, setIsWipeIn] = useState(false);
  const [shouldFocusIn, setShouldFocusIn] = useState(false);
  const [hexagramDrawId, setHexagramDrawId] = useState(0);
  const coinAudio = useMemo(() => new Audio(coinSound), []);
  const stickAudio = useMemo(() => new Audio(sticksound), []);
  const pendingResultRef = useRef<{ lines: number[]; number: number } | null>(null);
  const hexAnimDoneRef = useRef(false);

  const activeLanguage = languageOrder[0];

  const handleDivine = () => {
    if (isSpinning) return;

    coinAudio.currentTime = 0;
    void coinAudio.play();
    
    setIsSpinning(true);
    
    setTimeout(() => {
      const hexagram = generateHexagram();
      hexAnimDoneRef.current = false;
      stickAudio.currentTime = 0;
      void stickAudio.play();
      setResult(hexagram);
      setHexagramDrawId((previous) => previous + 1);
      pendingResultRef.current = hexagram;
      setIsSpinning(false);
    }, 4500);
  };

  const handleLanguageClick = (clickedLang: Language) => {
    if (clickedLang === activeLanguage || isTransitioning) return;
    
    setIsTransitioning(true);
    
    // Rotation rule: clicked becomes first, previous active becomes second
    const clickedIndex = languageOrder.indexOf(clickedLang);
    const previousActive = languageOrder[0];
    
    let newOrder: Language[];
    if (clickedIndex === 1) {
      // Clicked second line: [clicked, previousActive, remaining]
      newOrder = [clickedLang, previousActive, languageOrder[2]];
    } else {
      // Clicked third line: [clicked, previousActive, previousSecond]
      newOrder = [clickedLang, previousActive, languageOrder[1]];
    }
    
    setLanguageOrder(newOrder);
    
    // Trigger wipe animation for result text if displayed result exists
    if (displayedResult) {
      setIsWiping(true);
      setIsWipeIn(false);
      // Wipe out (800ms) + pause (400ms) = 1200ms, then switch language and wipe in (800ms)
      setTimeout(() => {
        setDisplayedLanguage(clickedLang);
        setIsWiping(false);
        setIsWipeIn(true);
        setTimeout(() => {
          setIsWipeIn(false);
        }, 1200);
      }, 1000);
    } else {
      setDisplayedLanguage(clickedLang);
    }
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 800);
  };

  // Update displayed language when no result yet
  const effectiveLanguage = displayedResult ? displayedLanguage : activeLanguage;

  const currentHexagram = result ? hexagrams[result.number as keyof typeof hexagrams] : null;
  const displayedHexagram = displayedResult ? hexagrams[displayedResult.number as keyof typeof hexagrams] : null;

  // Calculate position for each language based on order
  const getPositionStyle = (lang: Language) => {
  const index = languageOrder.indexOf(lang);
  const positions = [0, 60, 100];
  return {
    top: `${positions[index]}px`,
  };
};


return (<>

    <div className="pattern-strip pattern-strip--top" />

    <div className="page-content min-h-screen flex flex-col items-center justify-start px-4">
      <div className="max-w-2xl w-full space-y-4 text-center">
        {/* Animated Language Selector Titles */}
        <div className="title-container">
          {(['en', 'ru', 'zh'] as Language[]).map((lang) => {
            const isActive = languageOrder[0] === lang;
            const titleData = titles[lang];
            
            return (
              <div
                key={lang}
                onClick={() => !isActive && handleLanguageClick(lang)}
                className={`
                  language-title
                  ${isActive ? 'language-title-active' : 'language-title-inactive'}
                  lang-${lang}
                `}
                style={getPositionStyle(lang)}
                role={isActive ? undefined : "button"}
                tabIndex={isActive ? undefined : 0}
                onKeyDown={(e) => !isActive && e.key === 'Enter' && handleLanguageClick(lang)}
              >
                <span className="language-label">{titleData.label}</span>
                <span className="language-text">{titleData.title}</span>
              </div>
            );
          })}
        </div>

        <div className="pt-8"  style={{ marginTop: '20px' }}  >
          <div 
            onClick={handleDivine}
            className={`coin-element ${isSpinning ? 'spinning' : ''}`}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleDivine()}
            aria-label="Divine with coin"
          >
            <div className="coin-inner" />
          </div>
        </div>

        {result && currentHexagram && (
          <div className="space-y-2 result-appear">
            <div className="hexagram-stage">
              <div className="hexagram-reserve" aria-hidden="true" />
              <div className="hexagram-lines" style={{ height: "75px" }}>
                {result.lines.slice().reverse().map((line, index) => {
                  const delayMs = (result.lines.length - 1 - index) * 600;
                  const maxDelayMs = (result.lines.length - 1) * 600;
                  const isLastLine = delayMs === maxDelayMs;
                  const topOffset = index * 16;
                  const lineStyle: CSSProperties = {
                    animationDelay: `${delayMs}ms`,
                    "--hexagram-line-top": `${topOffset}px`
                  };
                  const handleLineAnimationEnd = () => {
                    if (!isLastLine || hexAnimDoneRef.current) return;
                    hexAnimDoneRef.current = true;
                    if (pendingResultRef.current) {
                      setDisplayedResult(pendingResultRef.current);
                      setShouldFocusIn(true);
                      pendingResultRef.current = null;
                    }
                  };
                  return (
                    <div
                      key={`${hexagramDrawId}-${index}`}
                      className="hexagram-line w-32 h-2 flex justify-center items-center"
                      style={lineStyle}
                      onAnimationEnd={isLastLine ? handleLineAnimationEnd : undefined}
                    >
                    {line === 1 ? (
                      <div className="w-full h-full bg-foreground" />
                    ) : (
                      <div className="w-full h-full flex gap-2">
                        <div className="flex-1 bg-foreground" />
                        <div className="flex-1 bg-foreground" />
                      </div>
                    )}
                    </div>
                  );
                })}
              </div>
            </div>

            {displayedResult && displayedHexagram && (
              <div
                key={displayedResult.number}
                className={`space-y-6 text-foreground result-lang-${effectiveLanguage}`}
              >
                <div
                  className={`wipe-text ${shouldFocusIn ? 'result-focus result-focus-1' : ''} ${isWiping ? 'wipe-out' : isWipeIn ? 'wipe-in' : ''}`}
                  style={{ animationDelay: shouldFocusIn ? '0ms' : isWiping ? '0ms' : '0ms' }}
                >
                  <p className="text-2xl font-normal result-line result-line-1">
                  {effectiveLanguage === 'en' && 'Hexagram'}
                  {effectiveLanguage === 'ru' && 'Гексаграмма'}
                  {effectiveLanguage === 'zh' && '卦象'} {displayedResult.number}
                  </p>
                </div>
                <div
                  className={`wipe-text ${shouldFocusIn ? 'result-focus result-focus-2' : ''} ${isWiping ? 'wipe-out' : isWipeIn ? 'wipe-in' : ''}`}
                  style={{ animationDelay: shouldFocusIn ? '0ms' : isWiping ? '0ms' : '200ms' }}
                >
                  <p className="text-xl font-normal result-line result-line-2">
                    {displayedHexagram[effectiveLanguage].name}
                  </p>
                </div>
                <div className="text-base max-w-2xl mx-auto leading-relaxed result-line result-line-3">
                  <div
                    className={`wipe-text ${shouldFocusIn ? 'result-focus result-focus-3' : ''} ${isWiping ? 'wipe-out' : isWipeIn ? 'wipe-in' : ''}`}
                    style={{ animationDelay: shouldFocusIn ? '0ms' : isWiping ? '0ms' : '300ms' }}
                    onAnimationEnd={shouldFocusIn ? () => setShouldFocusIn(false) : undefined}
                  >
                    <p>
                      {displayedHexagram[effectiveLanguage].interpretation}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>

    <div className="pattern-strip pattern-strip--bottom" />
     </>
);
};

export default Index;


