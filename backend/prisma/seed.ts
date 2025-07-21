import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.divinationCard.deleteMany();
  await prisma.divination.deleteMany();
  await prisma.tarotCard.deleteMany();
  await prisma.spread.deleteMany();

  // Create spreads
  const spreads = await Promise.all([
    prisma.spread.create({
      data: {
        name: '单张牌阵',
        description: '适用于快速指引、简单决策',
        cardCount: 1,
        positions: JSON.stringify([
          { name: '指引', meaning: '对当前情况的直接指引' }
        ])
      }
    }),
    prisma.spread.create({
      data: {
        name: '三张牌阵',
        description: '适用于过去、现在、未来的结构化分析',
        cardCount: 3,
        positions: JSON.stringify([
          { name: '过去', meaning: '影响当前情况的过去因素' },
          { name: '现在', meaning: '当前的状况和能量' },
          { name: '未来', meaning: '可能的发展方向' }
        ])
      }
    }),
    prisma.spread.create({
      data: {
        name: '凯尔特十字牌阵',
        description: '适用于复杂情感、人生方向、深度剖析',
        cardCount: 10,
        positions: JSON.stringify([
          { name: '现状', meaning: '问题的核心和现在的情况' },
          { name: '挑战/交叉', meaning: '面临的挑战或影响因素' },
          { name: '远因', meaning: '问题的根源或过去的影响' },
          { name: '近因', meaning: '最近发生的相关事件' },
          { name: '可能结果', meaning: '如果继续当前路径的可能结果' },
          { name: '近未来', meaning: '即将发生的事情' },
          { name: '内在态度', meaning: '你的内在态度和感受' },
          { name: '外在影响', meaning: '外部环境和他人的影响' },
          { name: '希望与恐惧', meaning: '你的希望或恐惧' },
          { name: '最终结果', meaning: '这个情况的最终结果' }
        ])
      }
    })
  ]);

  // Create Major Arcana cards
  const majorArcana = [
    { number: 0, name: '愚者', keywords: ['新开始', '冒险', '天真', '自由'] },
    { number: 1, name: '魔术师', keywords: ['创造力', '技能', '意志力', '行动'] },
    { number: 2, name: '女祭司', keywords: ['直觉', '潜意识', '神秘', '智慧'] },
    { number: 3, name: '女皇', keywords: ['丰饶', '母性', '创造', '自然'] },
    { number: 4, name: '皇帝', keywords: ['权威', '结构', '控制', '父性'] },
    { number: 5, name: '教皇', keywords: ['传统', '信仰', '教育', '精神指引'] },
    { number: 6, name: '恋人', keywords: ['爱情', '选择', '结合', '价值观'] },
    { number: 7, name: '战车', keywords: ['胜利', '意志', '控制', '决心'] },
    { number: 8, name: '力量', keywords: ['勇气', '耐心', '内在力量', '温柔'] },
    { number: 9, name: '隐士', keywords: ['内省', '寻求', '智慧', '孤独'] },
    { number: 10, name: '命运之轮', keywords: ['周期', '命运', '转折', '机遇'] },
    { number: 11, name: '正义', keywords: ['公正', '平衡', '真相', '因果'] },
    { number: 12, name: '倒吊人', keywords: ['牺牲', '等待', '新视角', '放手'] },
    { number: 13, name: '死神', keywords: ['结束', '转变', '重生', '放下'] },
    { number: 14, name: '节制', keywords: ['平衡', '耐心', '调和', '适度'] },
    { number: 15, name: '恶魔', keywords: ['束缚', '物质', '诱惑', '执着'] },
    { number: 16, name: '塔', keywords: ['突变', '破坏', '觉醒', '解放'] },
    { number: 17, name: '星星', keywords: ['希望', '灵感', '宁静', '信念'] },
    { number: 18, name: '月亮', keywords: ['幻觉', '恐惧', '潜意识', '直觉'] },
    { number: 19, name: '太阳', keywords: ['成功', '活力', '喜悦', '积极'] },
    { number: 20, name: '审判', keywords: ['复活', '评估', '觉醒', '召唤'] },
    { number: 21, name: '世界', keywords: ['完成', '成就', '圆满', '整合'] }
  ];

  for (const card of majorArcana) {
    await prisma.tarotCard.create({
      data: {
        name: card.name,
        arcana: 'Major',
        number: card.number,
        keywords: card.keywords.join(','),
        uprightMeaning: `${card.name}正位代表${card.keywords.slice(0, 2).join('、')}的能量。这是关于${card.keywords[0]}的时刻。`,
        reversedMeaning: `${card.name}逆位可能暗示${card.keywords[0]}的缺失或过度，需要重新审视${card.keywords[1]}。`
      }
    });
  }

  // Create sample Minor Arcana cards (权杖牌组示例)
  const wandsSuit = [
    { number: 1, name: '权杖王牌', keywords: ['灵感', '成长', '潜力', '新机遇'] },
    { number: 2, name: '权杖二', keywords: ['计划', '进展', '决策', '发现'] },
    { number: 3, name: '权杖三', keywords: ['扩展', '远见', '领导', '贸易'] },
    { number: 4, name: '权杖四', keywords: ['庆祝', '和谐', '休息', '家园'] },
    { number: 5, name: '权杖五', keywords: ['冲突', '竞争', '挑战', '差异'] },
    { number: 6, name: '权杖六', keywords: ['胜利', '认可', '进步', '自信'] },
    { number: 7, name: '权杖七', keywords: ['坚持', '防御', '挑战', '竞争'] },
    { number: 8, name: '权杖八', keywords: ['快速行动', '消息', '旅行', '变化'] },
    { number: 9, name: '权杖九', keywords: ['坚韧', '勇气', '持久', '边界'] },
    { number: 10, name: '权杖十', keywords: ['负担', '责任', '压力', '成就'] }
  ];

  for (const card of wandsSuit) {
    await prisma.tarotCard.create({
      data: {
        name: card.name,
        arcana: 'Minor',
        suit: 'Wands',
        number: card.number,
        keywords: card.keywords.join(','),
        uprightMeaning: `${card.name}正位象征着${card.keywords[0]}和${card.keywords[1]}的能量，鼓励你在行动中展现${card.keywords[2]}。`,
        reversedMeaning: `${card.name}逆位可能表示${card.keywords[0]}受阻或${card.keywords[3]}的挑战，需要重新评估你的方向。`
      }
    });
  }

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });