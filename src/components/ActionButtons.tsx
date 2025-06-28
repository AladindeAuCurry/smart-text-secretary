
import React, { useState } from 'react';
import { 
  Sparkles, 
  FileText, 
  Brain, 
  CheckSquare, 
  MessageSquare, 
  Languages,
  Loader
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ActionButtonsProps {
  originalText: string;
  onProcessText: (type: string, result: string) => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({ originalText, onProcessText }) => {
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const simulateAIProcessing = async (type: string): Promise<string> => {
    // Simulation de traitement IA
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    switch (type) {
      case 'clean':
        return `Bonjour et bienvenue dans ce podcast sur l'intelligence artificielle.

Aujourd'hui, nous allons parler des dernières avancées en matière de reconnaissance vocale et de traitement du langage naturel. L'IA a révolutionné notre façon de travailler, particulièrement dans le domaine de la transcription automatique.

Les modèles comme Whisper d'OpenAI permettent maintenant une précision remarquable, même avec des accents variés. Nous devons également discuter des implications éthiques de ces technologies. Il est crucial de maintenir la transparence et de respecter la vie privée des utilisateurs.

Pour la suite, nous prévoyons d'organiser une réunion la semaine prochaine pour définir les prochaines étapes de notre projet. N'oubliez pas de préparer vos présentations et de revoir le budget alloué.

Comme le disait Steve Jobs : "L'innovation distingue un leader d'un suiveur." Cette citation résume parfaitement l'esprit entrepreneurial qui doit nous guider.`;

      case 'summary':
        return `# Résumé du podcast

## Sujet principal
Discussion sur les avancées de l'IA en reconnaissance vocale et traitement du langage naturel.

## Points clés
• Les modèles comme Whisper d'OpenAI offrent une précision remarquable
• Importance des considérations éthiques et de la vie privée
• Planification d'une réunion pour définir les prochaines étapes

## Actions prévues
• Organisation d'une réunion la semaine prochaine
• Préparation des présentations nécessaires
• Révision du budget alloué au projet`;

      case 'themes':
        return `Intelligence artificielle et technologie
Reconnaissance vocale automatique
Traitement du langage naturel
Éthique et vie privée en IA
Gestion de projet et planification
Innovation et entrepreneuriat`;

      case 'actions':
        return `Organiser une réunion la semaine prochaine
Préparer les présentations pour la réunion
Revoir et valider le budget alloué au projet
Définir les prochaines étapes du développement
Étudier les implications éthiques des technologies utilisées`;

      case 'quotes':
        return `"L'innovation distingue un leader d'un suiveur" - Steve Jobs
"Il est crucial de maintenir la transparence et de respecter la vie privée des utilisateurs"
"L'IA a révolutionné notre façon de travailler"`;

      default:
        return 'Traitement effectué avec succès.';
    }
  };

  const handleAction = async (type: string, label: string) => {
    setLoadingAction(type);
    
    try {
      const result = await simulateAIProcessing(type);
      onProcessText(type, result);
      
      toast({
        title: "Action réalisée !",
        description: `${label} effectué avec succès.`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors du traitement.",
        variant: "destructive",
      });
    } finally {
      setLoadingAction(null);
    }
  };

  const actions = [
    {
      id: 'clean',
      label: 'Mettre au propre',
      icon: Sparkles,
      description: 'Corriger et améliorer le texte',
      gradient: 'from-green-500 to-emerald-600',
      bgGradient: 'from-green-500/10 to-emerald-500/10',
      borderColor: 'border-green-500/30'
    },
    {
      id: 'summary',
      label: 'Résumé',
      icon: FileText,
      description: 'Créer un résumé structuré',
      gradient: 'from-blue-500 to-cyan-600',
      bgGradient: 'from-blue-500/10 to-cyan-500/10',
      borderColor: 'border-blue-500/30'
    },
    {
      id: 'themes',
      label: 'Analyse thématique',
      icon: Brain,
      description: 'Extraire les thèmes principaux',
      gradient: 'from-purple-500 to-pink-600',
      bgGradient: 'from-purple-500/10 to-pink-500/10',
      borderColor: 'border-purple-500/30'
    },
    {
      id: 'actions',
      label: 'Actions à faire',
      icon: CheckSquare,
      description: 'Identifier les tâches concrètes',
      gradient: 'from-orange-500 to-red-600',
      bgGradient: 'from-orange-500/10 to-red-500/10',
      borderColor: 'border-orange-500/30'
    },
    {
      id: 'quotes',
      label: 'Citations clés',
      icon: MessageSquare,
      description: 'Extraire les phrases importantes',
      gradient: 'from-yellow-500 to-amber-600',
      bgGradient: 'from-yellow-500/10 to-amber-500/10',
      borderColor: 'border-yellow-500/30'
    },
    {
      id: 'translate',
      label: 'Traduire',
      icon: Languages,
      description: 'Traduire en anglais',
      gradient: 'from-indigo-500 to-purple-600',
      bgGradient: 'from-indigo-500/10 to-purple-500/10',
      borderColor: 'border-indigo-500/30'
    }
  ];

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
      <h3 className="text-2xl font-semibold text-white mb-6 flex items-center space-x-2">
        <span>🚀</span>
        <span>Actions intelligentes</span>
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {actions.map((action) => {
          const IconComponent = action.icon;
          const isLoading = loadingAction === action.id;
          
          return (
            <button
              key={action.id}
              onClick={() => handleAction(action.id, action.label)}
              disabled={isLoading || loadingAction !== null}
              className={`relative group p-6 rounded-xl border transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-br ${action.bgGradient} ${action.borderColor} hover:border-opacity-50`}
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className={`p-3 rounded-full bg-gradient-to-r ${action.gradient} text-white shadow-lg`}>
                  {isLoading ? (
                    <Loader className="w-6 h-6 animate-spin" />
                  ) : (
                    <IconComponent className="w-6 h-6" />
                  )}
                </div>
                
                <div>
                  <h4 className="font-semibold text-white mb-1">
                    {action.label}
                  </h4>
                  <p className="text-sm text-slate-400">
                    {action.description}
                  </p>
                </div>
              </div>
              
              {/* Effet de brillance au survol */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </button>
          );
        })}
      </div>
      
      <div className="mt-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
        <p className="text-sm text-slate-400 flex items-center space-x-2">
          <span>💡</span>
          <span>
            Cliquez sur une action pour traiter automatiquement votre transcription avec l'IA
          </span>
        </p>
      </div>
    </div>
  );
};
