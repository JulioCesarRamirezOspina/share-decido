import React, { useState } from 'react';
import { Search, Plus, List, Grid, Moon, Sun, Play, BookOpen, Brain, Download, Tag, Folder, Filter, Star, Clock, Eye, Trash2, Edit3 } from 'lucide-react';

const YouTubeClone = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState('');
  const [activeTab, setActiveTab] = useState('todos');
  const [videos, setVideos] = useState([
    {
      id: 1,
      title: 'The Most Aesthetic Content Slider That Warps Frames Like Liquid Glass',
      url: 'https://www.youtube.com/watch?v=example1',
      thumbnail: 'https://i.ytimg.com/vi/example1/maxresdefault.jpg',
      duration: '12:45',
      views: '45K',
      tags: ['animate', 'genkit', 'designcourse'],
      lists: ['genkit', 'profecias'],
      notes: 'Excelente tutorial sobre animaciones con GSAP',
      addedDate: '2024-01-15'
    },
    {
      id: 2,
      title: 'Advanced React Patterns and Performance Optimization',
      url: 'https://www.youtube.com/watch?v=example2',
      thumbnail: 'https://i.ytimg.com/vi/example2/maxresdefault.jpg',
      duration: '28:32',
      views: '128K',
      tags: ['react', 'performance', 'patterns'],
      lists: ['desarrollo', 'react-avanzado'],
      notes: 'Patrones avanzados de React muy útiles',
      addedDate: '2024-01-14'
    },
    {
      id: 3,
      title: 'AI-Powered Web Development: The Future is Here',
      url: 'https://www.youtube.com/watch?v=example3',
      thumbnail: 'https://i.ytimg.com/vi/example3/maxresdefault.jpg',
      duration: '18:20',
      views: '89K',
      tags: ['AI', 'webdev', 'future'],
      lists: ['IA', 'desarrollo'],
      notes: 'Interesante perspectiva sobre IA en desarrollo web',
      addedDate: '2024-01-13'
    }
  ]);

  const [playlists, setPlaylists] = useState([
    { id: 1, name: 'genkit', count: 4, color: '#8B5CF6' },
    { id: 2, name: 'profecias', count: 2, color: '#10B981' },
    { id: 3, name: 'crecimiento personal', count: 1, color: '#F59E0B' },
    { id: 4, name: 'vender', count: 2, color: '#EF4444' }
  ]);

  const [tags, setTags] = useState([
    '#Alejavi', '#Emprender', '#Eo', '#IA', '#Marian', '#agentesAI',
    '#animate', '#cerebro', '#designcourse', '#genkit', '#google',
    '#habitos', '#israel', '#local', '#mathi', '#open source',
    '#scrum', '#uiux'
  ]);

  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [showAddVideo, setShowAddVideo] = useState(false);

  const extractVideoId = (url) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return match ? match[1] : null;
  };

  const addVideo = async () => {
    if (!newVideoUrl) return;
    
    const videoId = extractVideoId(newVideoUrl);
    if (!videoId) {
      alert('URL de YouTube inválida');
      return;
    }

    const newVideo = {
      id: Date.now(),
      title: 'Nuevo Video Agregado',
      url: newVideoUrl,
      thumbnail: `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
      duration: '0:00',
      views: '0',
      tags: [],
      lists: [],
      notes: '',
      addedDate: new Date().toISOString().split('T')[0]
    };

    setVideos([newVideo, ...videos]);
    setNewVideoUrl('');
    setShowAddVideo(false);
  };

  const generateAIContent = async (type) => {
    if (!selectedVideo) return;
    
    setAiLoading(true);
    setShowAIPanel(true);
    
    try {
      const prompts = {
        resumen: `Crea un resumen ejecutivo del video "${selectedVideo.title}". Incluye los puntos clave, conceptos principales y conclusiones importantes. Estructura el resumen en párrafos claros y concisos.`,
        leccion: `Convierte el contenido del video "${selectedVideo.title}" en una lección estructurada. Incluye:
        - Objetivos de aprendizaje
        - Conceptos clave explicados paso a paso
        - Ejercicios prácticos o puntos de reflexión
        - Resumen final con puntos de acción`,
        experiencia: `Basándote en el video "${selectedVideo.title}", crea una experiencia interactiva de aprendizaje. Incluye:
        - Escenarios prácticos para aplicar los conceptos
        - Preguntas de reflexión profunda
        - Actividades hands-on
        - Métricas para medir el progreso`,
        codigo: `Extrae y explica todos los conceptos técnicos y código mostrado en el video "${selectedVideo.title}". Incluye:
        - Fragmentos de código con explicaciones
        - Mejores prácticas mencionadas
        - Recursos adicionales recomendados
        - Pasos para implementar lo aprendido`
      };

      const response = await window.claude.complete(prompts[type]);
      setAiResult(response);
    } catch (error) {
      setAiResult('Error al generar contenido. Por favor, intenta de nuevo.');
    } finally {
      setAiLoading(false);
    }
  };

  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (activeTab === 'todos') return matchesSearch;
    return matchesSearch && video.lists.includes(activeTab);
  });

  const VideoCard = ({ video }) => (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}>
      <div className="relative group">
        <img 
          src={video.thumbnail} 
          alt={video.title}
          className="w-full h-48 object-cover"
          onError={(e) => {
            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgdmlld0JveD0iMCAwIDMyMCAxODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMTgwIiBmaWxsPSIjMzc0MTUxIi8+CjxwYXRoIGQ9Ik0xMzAgNzBMMTkwIDEwNUwxMzAgMTQwVjcwWiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K';
          }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
          <Play className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={48} />
        </div>
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white px-2 py-1 rounded text-sm">
          {video.duration}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className={`font-semibold text-sm mb-2 line-clamp-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {video.title}
        </h3>
        
        <div className="flex items-center justify-between mb-3">
          <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {video.views} visualizaciones
          </span>
          <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {video.addedDate}
          </span>
        </div>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {video.tags.slice(0, 3).map(tag => (
            <span key={tag} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            <button 
              onClick={() => {
                setSelectedVideo(video);
                generateAIContent('resumen');
              }}
              className="p-2 rounded-full bg-purple-600 hover:bg-purple-700 transition-colors"
            >
              <BookOpen size={16} className="text-white" />
            </button>
            <button 
              onClick={() => {
                setSelectedVideo(video);
                generateAIContent('leccion');
              }}
              className="p-2 rounded-full bg-green-600 hover:bg-green-700 transition-colors"
            >
              <Brain size={16} className="text-white" />
            </button>
            <button 
              onClick={() => {
                setSelectedVideo(video);
                generateAIContent('experiencia');
              }}
              className="p-2 rounded-full bg-orange-600 hover:bg-orange-700 transition-colors"
            >
              <Star size={16} className="text-white" />
            </button>
          </div>
          
          <div className="flex space-x-1">
            <button className={`p-1 rounded ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}>
              <Edit3 size={14} className={darkMode ? 'text-gray-400' : 'text-gray-600'} />
            </button>
            <button className={`p-1 rounded ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}>
              <Trash2 size={14} className={darkMode ? 'text-gray-400' : 'text-gray-600'} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <header className={`${darkMode ? 'bg-gray-800' : 'bg-white'} border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} px-6 py-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            >
              <List size={24} className={darkMode ? 'text-white' : 'text-gray-900'} />
            </button>
            <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              YouTube Clone IA
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar videos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-80 pl-10 pr-4 py-2 rounded-lg border ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            
            <button
              onClick={() => setShowAddVideo(!showAddVideo)}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Plus size={20} />
              <span>Agregar Video</span>
            </button>
            
            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            >
              {viewMode === 'grid' ? 
                <List size={20} className={darkMode ? 'text-white' : 'text-gray-900'} /> : 
                <Grid size={20} className={darkMode ? 'text-white' : 'text-gray-900'} />
              }
            </button>
            
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            >
              {darkMode ? 
                <Sun size={20} className="text-yellow-400" /> : 
                <Moon size={20} className="text-gray-900" />
              }
            </button>
          </div>
        </div>
        
        {/* Add Video Form */}
        {showAddVideo && (
          <div className={`mt-4 p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <div className="flex space-x-4">
              <input
                type="url"
                placeholder="Pega aquí la URL de YouTube..."
                value={newVideoUrl}
                onChange={(e) => setNewVideoUrl(e.target.value)}
                className={`flex-1 px-4 py-2 rounded-lg border ${
                  darkMode 
                    ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
              <button
                onClick={addVideo}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Agregar
              </button>
            </div>
          </div>
        )}
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`${sidebarCollapsed ? 'w-16' : 'w-64'} ${darkMode ? 'bg-gray-800' : 'bg-white'} border-r ${darkMode ? 'border-gray-700' : 'border-gray-200'} transition-all duration-300`}>
          <div className="p-4">
            {/* Navigation */}
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('todos')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  activeTab === 'todos' 
                    ? 'bg-blue-600 text-white' 
                    : `${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`
                }`}
              >
                <Folder size={20} />
                {!sidebarCollapsed && <span>Todos los Videos</span>}
              </button>
              
              <button
                onClick={() => setActiveTab('sin-resumen')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  activeTab === 'sin-resumen' 
                    ? 'bg-blue-600 text-white' 
                    : `${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`
                }`}
              >
                <Clock size={20} />
                {!sidebarCollapsed && <span>Sin Resumen</span>}
              </button>
            </nav>
            
            {/* Playlists */}
            {!sidebarCollapsed && (
              <div className="mt-6">
                <h3 className={`text-sm font-semibold mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Listas
                </h3>
                <div className="space-y-2">
                  {playlists.map(playlist => (
                    <button
                      key={playlist.id}
                      onClick={() => setActiveTab(playlist.name)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                        activeTab === playlist.name 
                          ? 'bg-blue-600 text-white' 
                          : `${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: playlist.color }}
                        />
                        <span className="text-sm">{playlist.name}</span>
                      </div>
                      <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {playlist.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Tags */}
            {!sidebarCollapsed && (
              <div className="mt-6">
                <h3 className={`text-sm font-semibold mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Etiquetas
                </h3>
                <div className="flex flex-wrap gap-2">
                  {tags.slice(0, 12).map(tag => (
                    <span
                      key={tag}
                      className={`text-xs px-2 py-1 rounded-full cursor-pointer transition-colors ${
                        darkMode 
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {activeTab === 'todos' ? 'Todos los Videos' : `Lista: ${activeTab}`}
            </h2>
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {filteredVideos.length} videos
            </span>
          </div>
          
          <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'} gap-6`}>
            {filteredVideos.map(video => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        </main>
      </div>

      {/* AI Panel */}
      {showAIPanel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Contenido Generado por IA
              </h3>
              <button
                onClick={() => setShowAIPanel(false)}
                className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                ✕
              </button>
            </div>
            
            <div className="flex space-x-4 mb-4">
              <button
                onClick={() => generateAIContent('resumen')}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Resumen
              </button>
              <button
                onClick={() => generateAIContent('leccion')}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Lección
              </button>
              <button
                onClick={() => generateAIContent('experiencia')}
                className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Experiencia
              </button>
              <button
                onClick={() => generateAIContent('codigo')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Extraer Código
              </button>
            </div>
            
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} min-h-[300px]`}>
              {aiLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className={`ml-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Generando contenido...
                  </span>
                </div>
              ) : (
                <div className={`whitespace-pre-wrap ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {aiResult || 'Selecciona una opción para generar contenido con IA'}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default YouTubeClone;