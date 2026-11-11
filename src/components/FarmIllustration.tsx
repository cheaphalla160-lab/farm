import React from 'react';
import { playPronunciation } from '../utils/speech';
import { soundManager } from '../utils/sound';
import { Volume2, Sparkles } from 'lucide-react';

interface FarmIllustrationProps {
  harvestedApplesCount: number;
  highlightWord?: string | null;
  onSelectWord?: (wordId: string) => void;
  basketBounce?: boolean;
}

export const FarmIllustration: React.FC<FarmIllustrationProps> = ({
  harvestedApplesCount,
  highlightWord,
  onSelectWord,
  basketBounce = false
}) => {
  const handleItemClick = (word: string, meaning: string) => {
    soundManager.playClick();
    playPronunciation(word);
    if (onSelectWord) {
      onSelectWord(word);
    }
  };

  return (
    <div className="relative w-full overflow-hidden rounded-3xl bg-gradient-to-b from-sky-300 via-sky-200 to-amber-100 border-4 border-amber-300 shadow-xl select-none min-h-[320px] sm:min-h-[390px] transition-all">
      {/* Dynamic Sky & Clouds */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Soft Sun Ray Glow */}
        <div className="absolute -top-12 -right-12 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl" />

        {/* Floating Cartoon Clouds */}
        <div className="absolute top-6 left-10 flex items-center opacity-85 animate-[pulse_6s_ease-in-out_infinite]">
          <div className="w-16 h-8 bg-white/90 rounded-full shadow-sm" />
          <div className="w-10 h-10 -ml-6 -mt-3 bg-white/90 rounded-full shadow-sm" />
          <div className="w-12 h-6 -ml-3 mt-1 bg-white/90 rounded-full shadow-sm" />
        </div>

        <div className="absolute top-12 left-1/3 flex items-center opacity-70 animate-[pulse_8s_ease-in-out_infinite]">
          <div className="w-20 h-9 bg-white/80 rounded-full shadow-sm" />
          <div className="w-12 h-12 -ml-8 -mt-4 bg-white/80 rounded-full shadow-sm" />
          <div className="w-14 h-7 -ml-4 mt-1 bg-white/80 rounded-full shadow-sm" />
        </div>
      </div>

      {/* Target Word 1: SUNSHINE (阳光) */}
      <div
        onClick={() => handleItemClick('sunshine', '阳光')}
        className={`absolute top-4 right-6 sm:right-10 z-20 cursor-pointer group transition-all duration-300 ${
          highlightWord === 'sunshine' ? 'scale-110 ring-4 ring-yellow-400 rounded-full' : 'hover:scale-105'
        }`}
        title="Click to hear: sunshine (阳光)"
      >
        <div className="relative flex items-center justify-center">
          {/* Rotating Sun Rays */}
          <svg className="w-24 h-24 sm:w-28 sm:h-28 text-yellow-400 animate-[spin_24s_linear_infinite]" viewBox="0 0 100 100" fill="currentColor">
            {[...Array(12)].map((_, i) => (
              <polygon
                key={i}
                points="50,6 46,24 54,24"
                transform={`rotate(${i * 30} 50 50)`}
                className="opacity-90"
              />
            ))}
          </svg>

          {/* Cute Smiling Sun Core */}
          <div className="absolute w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 shadow-lg shadow-yellow-400/50 flex flex-col items-center justify-center border-2 border-yellow-200">
            {/* Eyes and Smile */}
            <div className="flex gap-2.5 mt-2">
              <span className="w-1.5 h-2 bg-amber-950 rounded-full animate-bounce" />
              <span className="w-1.5 h-2 bg-amber-950 rounded-full animate-bounce" />
            </div>
            {/* Blush cheeks */}
            <div className="flex justify-between w-9 px-1 -mt-0.5">
              <span className="w-2 h-1 bg-rose-400/80 rounded-full" />
              <span className="w-2 h-1 bg-rose-400/80 rounded-full" />
            </div>
            {/* Happy Smile curve */}
            <div className="w-4 h-2 border-b-2 border-amber-950 rounded-full mt-0.5" />
          </div>

          {/* Vocabulary Tag */}
          <div className="absolute -bottom-2 bg-yellow-400/95 text-amber-950 font-bold text-xs px-2 py-0.5 rounded-full shadow border border-yellow-200 flex items-center gap-1 group-hover:bg-yellow-300">
            <span>sunshine</span>
            <Volume2 className="w-3 h-3 text-amber-800" />
          </div>
        </div>
      </div>

      {/* Rolling Hills & Green Meadow */}
      <div className="absolute bottom-0 inset-x-0 h-48 sm:h-56 pointer-events-none">
        {/* Distant gentle hills */}
        <div className="absolute -bottom-8 -left-20 w-[600px] h-48 bg-emerald-300 rounded-[100%] opacity-85" />
        <div className="absolute -bottom-10 right-0 w-[500px] h-52 bg-emerald-400 rounded-[100%] opacity-90" />
        {/* Fore hill */}
        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-emerald-600 via-emerald-500 to-emerald-400 rounded-t-[50px] border-t-4 border-emerald-300" />
      </div>

      {/* Target Word 2: FARM (农场) - Country Barn & Windmill */}
      <div
        onClick={() => handleItemClick('farm', '农场')}
        className={`absolute bottom-24 sm:bottom-28 left-4 sm:left-12 z-10 cursor-pointer group transition-all duration-300 ${
          highlightWord === 'farm' ? 'scale-110 ring-4 ring-emerald-400 rounded-2xl' : 'hover:scale-105'
        }`}
        title="Click to hear: farm (农场)"
      >
        <div className="relative">
          {/* Little Red Barn */}
          <div className="w-28 sm:w-36 h-24 sm:h-28 bg-gradient-to-b from-rose-600 to-rose-700 rounded-t-xl border-2 border-rose-900 shadow-lg relative flex flex-col items-center">
            {/* Barn Roof */}
            <div className="absolute -top-7 sm:-top-8 w-32 sm:w-40 h-8 bg-stone-700 rounded-t-md border-b-2 border-stone-900 shadow" />
            {/* Weather Vane */}
            <div className="absolute -top-11 text-amber-400 text-sm font-bold">
              🐓
            </div>
            {/* Barn Cross Door */}
            <div className="w-12 sm:w-16 h-14 sm:h-16 bg-amber-900/90 rounded-t-lg mt-auto mb-0 border-2 border-amber-950 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 border-t-2 border-white/40 rotate-45 transform origin-center" />
              <div className="absolute inset-0 border-t-2 border-white/40 -rotate-45 transform origin-center" />
            </div>
          </div>

          {/* Wooden Picket Fence */}
          <div className="absolute -right-12 sm:-right-16 bottom-0 flex gap-1 pointer-events-none">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-2.5 h-10 bg-amber-200 border border-amber-600 rounded-t-sm relative shadow-sm">
                <div className="absolute top-2 -left-1 -right-1 h-1.5 bg-amber-300 border border-amber-700" />
              </div>
            ))}
          </div>

          {/* Vocabulary Tag */}
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-rose-600 text-white font-bold text-xs px-2.5 py-0.5 rounded-full shadow border border-rose-300 flex items-center gap-1 group-hover:bg-rose-500 whitespace-nowrap">
            <span>farm</span>
            <Volume2 className="w-3 h-3 text-rose-200" />
          </div>
        </div>
      </div>

      {/* Target Word 3: FARMER (农民) - Friendly waving farmer */}
      <div
        onClick={() => handleItemClick('farmer', '农民')}
        className={`absolute bottom-4 sm:bottom-6 left-32 sm:left-48 z-20 cursor-pointer group transition-all duration-300 ${
          highlightWord === 'farmer' ? 'scale-110 ring-4 ring-amber-400 rounded-2xl' : 'hover:scale-105'
        }`}
        title="Click to hear: farmer (农民)"
      >
        <div className="relative flex flex-col items-center">
          {/* Speech bubble */}
          <div className="bg-white px-2.5 py-1 rounded-xl shadow-md border border-amber-300 text-amber-950 text-xs font-bold mb-1 flex items-center gap-1 animate-pulse">
            <span>Let's pick apples!</span>
            <Sparkles className="w-3 h-3 text-amber-500" />
          </div>

          {/* Farmer Character Art (SVG + CSS) */}
          <div className="relative w-16 h-24 sm:w-18 sm:h-28 flex flex-col items-center">
            {/* Straw Hat */}
            <div className="w-16 h-5 bg-amber-300 border-2 border-amber-700 rounded-full shadow relative z-20 -mb-2">
              <div className="w-9 h-3.5 bg-amber-400 border border-amber-700 rounded-t-lg mx-auto -mt-2.5" />
              <div className="w-9 h-1 bg-red-500 mx-auto -mt-1" />
            </div>

            {/* Farmer Face */}
            <div className="w-9 h-9 bg-amber-100 rounded-full border border-amber-600 relative z-10 flex flex-col items-center justify-center shadow-inner">
              <div className="flex gap-2 mt-1">
                <span className="w-1 h-1.5 bg-amber-950 rounded-full" />
                <span className="w-1 h-1.5 bg-amber-950 rounded-full" />
              </div>
              <div className="w-3 h-1.5 border-b-2 border-amber-900 rounded-full mt-0.5" />
              {/* Rosy cheeks */}
              <div className="flex justify-between w-6 px-0.5 -mt-0.5">
                <span className="w-1.5 h-1 bg-rose-400 rounded-full" />
                <span className="w-1.5 h-1 bg-rose-400 rounded-full" />
              </div>
            </div>

            {/* Farmer Overalls & Plaid Shirt */}
            <div className="w-11 h-12 bg-blue-600 border border-blue-900 rounded-t-md relative -mt-1 flex flex-col items-center shadow">
              {/* Overalls Straps */}
              <div className="flex justify-between w-9 mt-0.5">
                <div className="w-2.5 h-5 bg-blue-700 border-r border-blue-900 relative">
                  <span className="w-1 h-1 bg-amber-300 rounded-full absolute bottom-0.5 left-0.5" />
                </div>
                <div className="w-2.5 h-5 bg-blue-700 border-l border-blue-900 relative">
                  <span className="w-1 h-1 bg-amber-300 rounded-full absolute bottom-0.5 right-0.5" />
                </div>
              </div>
              {/* Waving Hand */}
              <div className="absolute -left-3 top-2 text-sm animate-wiggle">
                👋
              </div>
            </div>

            {/* Boots */}
            <div className="flex gap-1 -mt-0.5">
              <div className="w-3.5 h-3 bg-amber-950 rounded-b-sm" />
              <div className="w-3.5 h-3 bg-amber-950 rounded-b-sm" />
            </div>
          </div>

          {/* Vocabulary Tag */}
          <div className="bg-amber-500 text-amber-950 font-bold text-xs px-2.5 py-0.5 rounded-full shadow border border-amber-300 flex items-center gap-1 group-hover:bg-amber-400 mt-1">
            <span>farmer</span>
            <Volume2 className="w-3 h-3 text-amber-900" />
          </div>
        </div>
      </div>

      {/* Target Word 6: POTATO (土豆) - Garden soil patch with potatoes */}
      <div
        onClick={() => handleItemClick('potato', '土豆')}
        className={`absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 sm:left-80 z-20 cursor-pointer group transition-all duration-300 ${
          highlightWord === 'potato' ? 'scale-110 ring-4 ring-amber-700 rounded-2xl' : 'hover:scale-105'
        }`}
        title="Click to hear: potato (土豆)"
      >
        <div className="relative flex flex-col items-center">
          {/* Dark Soil Mound */}
          <div className="w-24 sm:w-28 h-10 bg-amber-950/80 rounded-t-[28px] border-2 border-amber-900 shadow-md relative flex items-center justify-around px-2 pt-1">
            {/* Green potato leaves sprouting */}
            <div className="absolute -top-3 left-3 text-emerald-500 text-base">
              🌿
            </div>
            <div className="absolute -top-4 right-5 text-emerald-500 text-base">
              🌱
            </div>

            {/* Earthy Potato 1 */}
            <div className="w-6 h-5 bg-amber-700 rounded-full border border-amber-900 shadow flex items-center justify-center text-[10px] transform -rotate-12">
              🥔
            </div>
            {/* Earthy Potato 2 */}
            <div className="w-7 h-5 bg-amber-600 rounded-full border border-amber-900 shadow flex items-center justify-center text-xs transform rotate-6">
              🥔
            </div>
          </div>

          {/* Vocabulary Tag */}
          <div className="bg-amber-800 text-white font-bold text-xs px-2.5 py-0.5 rounded-full shadow border border-amber-600 flex items-center gap-1 group-hover:bg-amber-700 mt-1">
            <span>potato</span>
            <Volume2 className="w-3 h-3 text-amber-200" />
          </div>
        </div>
      </div>

      {/* Target Word 4: BASKET (篮子) - Rustic woven harvest basket */}
      <div
        onClick={() => handleItemClick('basket', '篮子')}
        className={`absolute bottom-3 sm:bottom-5 right-4 sm:right-16 z-30 cursor-pointer group transition-all duration-300 ${
          basketBounce ? 'animate-bounce' : ''
        } ${highlightWord === 'basket' ? 'scale-110 ring-4 ring-orange-400 rounded-2xl' : 'hover:scale-105'}`}
        title="Click to hear: basket (篮子)"
      >
        <div className="relative flex flex-col items-center">
          {/* Harvest Count Badge */}
          <div className="absolute -top-4 right-0 z-40 bg-red-600 text-white font-black text-xs px-2 py-0.5 rounded-full border-2 border-white shadow-lg animate-pulse">
            {harvestedApplesCount} 🍎
          </div>

          {/* Wicker Basket Art */}
          <div className="w-24 sm:w-28 h-16 sm:h-20 bg-gradient-to-b from-amber-700 via-amber-800 to-amber-950 rounded-b-3xl border-3 border-amber-950 shadow-2xl relative overflow-hidden flex flex-col items-center pt-1">
            {/* Wicker Rim */}
            <div className="w-full h-3.5 bg-amber-600 border-b-2 border-amber-900 rounded-t-sm shadow-inner flex justify-around">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="w-1.5 h-full bg-amber-800/60" />
              ))}
            </div>

            {/* Apples inside basket */}
            <div className="flex gap-1 items-center -mt-1 z-10">
              <span className="text-xl -mr-1">🍎</span>
              <span className="text-2xl z-20">🍎</span>
              <span className="text-xl -ml-1">🍎</span>
            </div>

            {/* Woven Cross-hatch texture */}
            <div className="absolute inset-x-0 bottom-0 top-3 pointer-events-none opacity-25 bg-[radial-gradient(#fde68a_1px,transparent_1px)] [background-size:8px_8px]" />
          </div>

          {/* Basket Handle Arc */}
          <div className="absolute -top-6 inset-x-3 h-12 border-4 border-amber-700 rounded-t-full pointer-events-none" />

          {/* Vocabulary Tag */}
          <div className="bg-amber-700 text-amber-100 font-bold text-xs px-2.5 py-0.5 rounded-full shadow border border-amber-500 flex items-center gap-1 group-hover:bg-amber-600 mt-1">
            <span>basket</span>
            <Volume2 className="w-3 h-3 text-amber-200" />
          </div>
        </div>
      </div>
    </div>
  );
};
