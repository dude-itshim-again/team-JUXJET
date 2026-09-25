import React from 'react';
import { Lightbulb, Wrench, Target, FlaskConical, Cpu } from 'lucide-react';

interface AiTriageBadgesProps {
  classification?: string | null;
  sdg_target?: number | null;
  extracted_skills?: string[] | null;
  compact?: boolean;
}

export const AiTriageBadges: React.FC<AiTriageBadgesProps> = ({
  classification,
  sdg_target,
  extracted_skills,
  compact = false,
}) => {
  // Infer defaults if missing
  const normClassification = (classification || 'INNOVATION').toUpperCase();

  const getSdgLabel = (sdg: number) => {
    switch (sdg) {
      case 6:
        return 'SDG 6: Clean Water';
      case 9:
        return 'SDG 9: Industry & Infra';
      case 2:
        return 'SDG 2: Zero Hunger';
      case 3:
        return 'SDG 3: Good Health';
      case 11:
        return 'SDG 11: Sustainable Cities';
      default:
        return `SDG ${sdg}`;
    }
  };

  const getSkillIcon = (skill: string) => {
    const s = skill.toLowerCase();
    if (s.includes('chemical') || s.includes('filtration') || s.includes('spectroscopy')) {
      return <FlaskConical className="w-2.5 h-2.5 text-teal-600 shrink-0" />;
    }
    if (s.includes('iot') || s.includes('sensor')) {
      return <Cpu className="w-2.5 h-2.5 text-indigo-600 shrink-0" />;
    }
    return <Wrench className="w-2.5 h-2.5 text-amber-600 shrink-0" />;
  };

  return (
    <div className={`flex flex-wrap items-center gap-1.5 ${compact ? 'text-[10px]' : 'text-xs'}`}>
      {/* Classification Tag */}
      {normClassification === 'INNOVATION' ? (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold bg-purple-100 text-purple-900 border border-purple-300 shadow-2xs">
          <Lightbulb className="w-3.5 h-3.5 text-purple-700 fill-purple-200" />
          <span>INNOVATION</span>
        </span>
      ) : (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold bg-orange-100 text-orange-900 border border-orange-300 shadow-2xs">
          <Wrench className="w-3.5 h-3.5 text-orange-700" />
          <span>GRIEVANCE</span>
        </span>
      )}

      {/* SDG Target Tag */}
      {sdg_target && (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
          <Target className="w-2.5 h-2.5 text-emerald-600" />
          <span>{getSdgLabel(sdg_target)}</span>
        </span>
      )}

      {/* Extracted Skills Chips */}
      {extracted_skills && extracted_skills.length > 0 && (
        <div className="flex flex-wrap items-center gap-1">
          {extracted_skills.map((skill, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 font-medium text-[10px]"
            >
              {getSkillIcon(skill)}
              <span>{skill}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
