import React, { useState } from 'react';
import { CORE_VOCABULARY, BONUS_VOCABULARY } from '../data/words';
import { playPronunciation } from '../utils/speech';
import { soundManager } from '../utils/sound';
import {
  GraduationCap,
  BookOpen,
  Volume2,
  Sparkles,
  CheckCircle,
  Clock,
  Target,
  Users,
  Printer,
  ChevronRight,
  Layers,
  FileText
} from 'lucide-react';

export const TeacherPrepView: React.FC = () => {
  const [selectedWord, setSelectedWord] = useState(CORE_VOCABULARY[0]);
  const [activeSubTab, setActiveSubTab] = useState<'flashcards' | 'lesson-plan' | 'worksheet'>('flashcards');

  const handlePlayWord = (word: string, rate: number = 0.9) => {
    soundManager.playClick();
    playPronunciation(word, rate);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 flex flex-col gap-6 select-none">
      {/* Teacher Assistant Header */}
      <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-purple-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-xs rounded-full text-xs font-black uppercase tracking-wider mb-2">
            <GraduationCap className="w-4 h-4 text-amber-300" />
            <span>Senior Lesson Prep Assistant · 高级备课助手</span>
          </div>
          <h2 className="font-['Fredoka',sans-serif] text-3xl sm:text-4xl font-extrabold tracking-wide">
            Agriculture Vocabulary Teaching Kit
          </h2>
          <p className="text-indigo-100 text-sm mt-1 max-w-xl font-medium">
            专为高年级英语老师设计的备课方案：涵盖词汇音标分解、构词法、例句、课堂活动教案及打印材料。
          </p>
        </div>

        {/* Sub-nav tabs */}
        <div className="flex bg-indigo-900/40 p-1.5 rounded-2xl border border-indigo-400/30">
          <button
            onClick={() => { soundManager.playClick(); setActiveSubTab('flashcards'); }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeSubTab === 'flashcards'
                ? 'bg-white text-indigo-950 shadow-md scale-102'
                : 'text-indigo-200 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>互动单词卡片</span>
          </button>

          <button
            onClick={() => { soundManager.playClick(); setActiveSubTab('lesson-plan'); }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeSubTab === 'lesson-plan'
                ? 'bg-white text-indigo-950 shadow-md scale-102'
                : 'text-indigo-200 hover:text-white'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>45分钟教案设计</span>
          </button>

          <button
            onClick={() => { soundManager.playClick(); setActiveSubTab('worksheet'); }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeSubTab === 'worksheet'
                ? 'bg-white text-indigo-950 shadow-md scale-102'
                : 'text-indigo-200 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>随堂练习清单</span>
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: VOCABULARY FLASHCARDS */}
      {activeSubTab === 'flashcards' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Word Selector List */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-4 border-4 border-indigo-100 shadow-md flex flex-col gap-2">
            <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider px-2 py-1">
              核心农业词汇 (Core 6 Words)
            </h3>
            {CORE_VOCABULARY.map((word) => (
              <button
                key={word.id}
                onClick={() => {
                  soundManager.playClick();
                  setSelectedWord(word);
                  handlePlayWord(word.word);
                }}
                className={`w-full p-3 rounded-2xl flex items-center justify-between transition-all border-2 text-left ${
                  selectedWord.id === word.id
                    ? 'bg-indigo-50 border-indigo-500 shadow-sm'
                    : 'bg-slate-50 border-transparent hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-sm"
                    style={{ backgroundColor: word.color }}
                  >
                    {word.word[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="font-['Fredoka',sans-serif] text-base font-bold text-slate-800">
                      {word.word}
                    </p>
                    <p className="text-xs text-slate-500 font-mono">
                      {word.ipa} · {word.meaning}
                    </p>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 ${selectedWord.id === word.id ? 'text-indigo-600' : 'text-slate-300'}`} />
              </button>
            ))}

            <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider px-2 py-1 mt-2">
              扩展进阶词汇 (Bonus Vocabulary)
            </h3>
            {BONUS_VOCABULARY.map((word) => (
              <button
                key={word.id}
                onClick={() => {
                  soundManager.playClick();
                  setSelectedWord(word);
                  handlePlayWord(word.word);
                }}
                className={`w-full p-3 rounded-2xl flex items-center justify-between transition-all border-2 text-left ${
                  selectedWord.id === word.id
                    ? 'bg-indigo-50 border-indigo-500 shadow-sm'
                    : 'bg-slate-50 border-transparent hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-sm"
                    style={{ backgroundColor: word.color }}
                  >
                    {word.word[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="font-['Fredoka',sans-serif] text-base font-bold text-slate-800">
                      {word.word}
                    </p>
                    <p className="text-xs text-slate-500 font-mono">
                      {word.ipa} · {word.meaning}
                    </p>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 ${selectedWord.id === word.id ? 'text-indigo-600' : 'text-slate-300'}`} />
              </button>
            ))}
          </div>

          {/* Right Column: Large Teaching Display Card */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border-4 border-indigo-100 shadow-xl flex flex-col justify-between">
            <div>
              {/* Top meta tags */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-xs font-bold rounded-full">
                    {selectedWord.category === 'core' ? '教学核心大纲词' : '拓展进阶词'}
                  </span>
                  <span className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-mono font-bold rounded-lg">
                    {selectedWord.partOfSpeech}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePlayWord(selectedWord.word, 0.9)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow active:scale-95"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>原速范读 (1.0x)</span>
                  </button>
                  <button
                    onClick={() => handlePlayWord(selectedWord.word, 0.65)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold transition-all active:scale-95"
                  >
                    <Volume2 className="w-4 h-4 text-indigo-500" />
                    <span>慢速领读 (0.65x)</span>
                  </button>
                </div>
              </div>

              {/* Huge Word Title */}
              <div className="text-center my-4">
                <h1 className="font-['Fredoka',sans-serif] text-5xl sm:text-6xl font-black text-slate-900 tracking-wider">
                  {selectedWord.word}
                </h1>

                <div className="flex items-center justify-center gap-3 mt-2">
                  <span className="font-mono text-xl sm:text-2xl font-bold text-indigo-600 bg-indigo-50 px-4 py-1 rounded-xl border border-indigo-200">
                    {selectedWord.ipa}
                  </span>
                  <span className="text-xl sm:text-2xl font-bold text-amber-800 bg-amber-50 px-4 py-1 rounded-xl border border-amber-200">
                    {selectedWord.meaning}
                  </span>
                </div>

                {/* Phonics Syllable breakdown */}
                <div className="inline-flex items-center gap-2 mt-4 px-4 py-1.5 bg-slate-100 rounded-full text-sm font-bold text-slate-700">
                  <span>自然拼读音节划分:</span>
                  <span className="font-mono text-indigo-700 font-extrabold tracking-widest text-base">
                    {selectedWord.syllables.join(' - ')}
                  </span>
                </div>
              </div>

              {/* Teacher Pedagogy Notes & Mnemonic */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-amber-50/80 rounded-2xl p-4 border border-amber-200">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-900 mb-1">
                    <BookOpen className="w-4 h-4 text-amber-600" />
                    <span>教学法与发音精讲 (Teacher Phonics Guidance)</span>
                  </div>
                  <p className="text-xs text-amber-950 font-medium leading-relaxed">
                    {selectedWord.teacherNote}
                  </p>
                </div>

                <div className="bg-emerald-50/80 rounded-2xl p-4 border border-emerald-200">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 mb-1">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>农业科学趣味小百科 (Agri-Science Fun Fact)</span>
                  </div>
                  <p className="text-xs text-emerald-950 font-medium leading-relaxed">
                    {selectedWord.funFact}
                  </p>
                </div>
              </div>

              {/* Context Example Sentence */}
              <div className="mt-4 bg-slate-50 rounded-2xl p-4 border border-slate-200 flex items-start gap-3">
                <button
                  onClick={() => handlePlayWord(selectedWord.example, 0.85)}
                  className="mt-0.5 p-2 bg-indigo-100 hover:bg-indigo-200 rounded-xl text-indigo-800 shrink-0"
                  title="播放例句发音"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    "{selectedWord.example}"
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {selectedWord.exampleTranslation}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick classroom tip footer */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <span>💡 课堂技巧：利用大屏幕投影本页，带领全班分音节击掌拼读 (Clap & Chant)。</span>
              <span className="font-mono font-bold text-indigo-600">Unit: Nature & Agriculture</span>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: 45-MIN LESSON PLAN */}
      {activeSubTab === 'lesson-plan' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-indigo-100 shadow-xl flex flex-col gap-6">
          <div className="border-b border-slate-200 pb-4">
            <span className="text-xs font-black uppercase text-indigo-600 tracking-wider">
              Teaching Design & Objectives
            </span>
            <h3 className="font-['Fredoka',sans-serif] text-2xl font-bold text-slate-900 mt-1">
              Unit: "A Sunny Day on the Farm" (小学高年级英语农业主题教案)
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              适用对象：小学五、六年级 | 课时：45分钟 | 教学工具：智能白板 + 互动摘苹果游戏网页
            </p>
          </div>

          {/* Objectives Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-200">
              <div className="flex items-center gap-2 font-bold text-indigo-900 text-sm mb-1.5">
                <Target className="w-4 h-4 text-indigo-600" />
                <span>1. 语言知识目标</span>
              </div>
              <ul className="text-xs text-indigo-950 space-y-1 list-disc list-inside">
                <li>精准识记 6 个农业核心词：farm, farmer, sunshine, basket, apple, potato</li>
                <li>掌握复合词 sunshine = sun + shine 的构词法</li>
                <li>掌握 /ɑːr/ 卷舌音与弱读音节发音规则</li>
              </ul>
            </div>

            <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200">
              <div className="flex items-center gap-2 font-bold text-emerald-900 text-sm mb-1.5">
                <Users className="w-4 h-4 text-emerald-600" />
                <span>2. 语言技能与交互目标</span>
              </div>
              <ul className="text-xs text-emerald-950 space-y-1 list-disc list-inside">
                <li>听音辨词：听教师/游戏音频快速识别并采摘对应苹果</li>
                <li>模仿跟读：看音标大声朗读，在跟读评测中争取 3 颗星</li>
                <li>情境表达：能运用例句介绍农场丰收场景</li>
              </ul>
            </div>

            <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200">
              <div className="flex items-center gap-2 font-bold text-amber-900 text-sm mb-1.5">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>3. 情感与素养目标</span>
              </div>
              <ul className="text-xs text-amber-950 space-y-1 list-disc list-inside">
                <li>体会农业耕作的辛劳与快乐，珍惜粮食</li>
                <li>在趣味竞技中建立自信，享受大声说英语的乐趣</li>
                <li>通过排行榜形成小组合作与良性竞争氛围</li>
              </ul>
            </div>
          </div>

          {/* 4 Stages breakdown */}
          <div className="space-y-4">
            <h4 className="font-bold text-slate-800 text-base">
              四步环环相扣教学流程 (4-Stage Instructional Flow):
            </h4>

            <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0">
                1
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm">
                    热身导入与情境感知 (Warm-up & Setting the Scene)
                  </span>
                  <span className="text-xs font-semibold text-slate-400 bg-white px-2 py-0.5 rounded border">
                    5 分钟
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  播放游戏中的欢快乡村背景音乐，展示农场全景图。引导提问："Look! What can you see on our farm? What shines in the sky?" 激发学生对 sunshine, farm 等词的情景联想。
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0">
                2
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm">
                    音节切分与示范精讲 (Phonics & Syllables Presentation)
                  </span>
                  <span className="text-xs font-semibold text-slate-400 bg-white px-2 py-0.5 rounded border">
                    12 分钟
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  切换至本备课助手“互动单词卡片”视图。利用慢速 (0.65x) 播放发音，带领学生按音节 clap (拍手)：sun-shine (2拍)、far-mer (2拍)、po-ta-to (3拍，重点突出第二音节重音)。
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="w-8 h-8 rounded-xl bg-amber-600 text-white font-bold flex items-center justify-center shrink-0">
                3
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm">
                    Farm Explorer 农场漫步大探险与跟读闯关 (Interactive Quest & Read-Aloud)
                  </span>
                  <span className="text-xs font-semibold text-slate-400 bg-white px-2 py-0.5 rounded border">
                    20 分钟
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  启动核心“Farm Explorer”模块。系统依次提问："Where is the farmer / basket / apple tree / potato / sunshine?"，学生操纵小探险家在农场小径一步一步走。发现目标点击后，小探险家走上前触发欢呼，随即进入“跟读评测”环节，全班配合麦克风大声朗读，争夺三星徽章！还可以切换至摘苹果果园进行采摘扩展。
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="w-8 h-8 rounded-xl bg-purple-600 text-white font-bold flex items-center justify-center shrink-0">
                4
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm">
                    积分排行榜揭晓与奖状颁发 (Leaderboard & Certificate Awarding)
                  </span>
                  <span className="text-xs font-semibold text-slate-400 bg-white px-2 py-0.5 rounded border">
                    8 分钟
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  展示班级排行榜，为本节课积分最高或发音最纯正的“农场小能手”颁发内置的荣誉奖状（Certificate of Achievement），鼓励学生课后继续复习巩固。
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: PRINTABLE DRILL / WORKSHEET */}
      {activeSubTab === 'worksheet' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-4 border-indigo-100 shadow-xl flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <h3 className="font-['Fredoka',sans-serif] text-2xl font-bold text-slate-900">
                Classroom Quick Quiz & Drill Sheet (随堂速测练习)
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                老师可直接复印或投影在黑板上，供学生进行单词拼写与连线配对。
              </p>
            </div>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow"
            >
              <Printer className="w-4 h-4" />
              <span>打印练习卷</span>
            </button>
          </div>

          {/* Drill 1: Syllable Matching */}
          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200">
            <h4 className="font-bold text-amber-950 text-sm mb-3">
              Task 1: Syllable Puzzle (拼音节找单词)
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-2.5 bg-white rounded-xl border border-amber-300">
                1. far + mer = <span className="font-mono font-bold text-indigo-700">______</span>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-amber-300">
                2. sun + shine = <span className="font-mono font-bold text-indigo-700">______</span>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-amber-300">
                3. bas + ket = <span className="font-mono font-bold text-indigo-700">______</span>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-amber-300">
                4. ap + ple = <span className="font-mono font-bold text-indigo-700">______</span>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-amber-300">
                5. po + ta + to = <span className="font-mono font-bold text-indigo-700">______</span>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-amber-300">
                6. f + arm = <span className="font-mono font-bold text-indigo-700">______</span>
              </div>
            </div>
          </div>

          {/* Drill 2: Sentence Cloze */}
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
            <h4 className="font-bold text-emerald-950 text-sm mb-3">
              Task 2: Farm Sentence Fill-in (结合情境选词填空)
            </h4>
            <div className="space-y-2 text-xs text-slate-800">
              <p className="p-2 bg-white rounded-lg border border-emerald-200">
                1. The warm <span className="font-bold text-indigo-700">[&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;]</span> makes our green plants grow tall.
              </p>
              <p className="p-2 bg-white rounded-lg border border-emerald-200">
                2. The kind <span className="font-bold text-indigo-700">[&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;]</span> feeds the animals early in the morning.
              </p>
              <p className="p-2 bg-white rounded-lg border border-emerald-200">
                3. Let's put these delicious red apples into our wooden <span className="font-bold text-indigo-700">[&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;]</span>.
              </p>
              <p className="p-2 bg-white rounded-lg border border-emerald-200">
                4. We dug fresh brown <span className="font-bold text-indigo-700">[&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;]</span> out of the healthy soil.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
