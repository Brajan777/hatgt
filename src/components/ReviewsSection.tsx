import React, { useState } from 'react';
import { Star, CheckCircle, MessageSquarePlus, MapPin, X } from 'lucide-react';
import { ProductReview } from '../types';

interface ReviewsSectionProps {
  reviews: ProductReview[];
  onAddReview: (review: ProductReview) => void;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ reviews, onAddReview }) => {
  const [selectedStarFilter, setSelectedStarFilter] = useState<number | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  
  // Form State
  const [author, setAuthor] = useState('');
  const [location, setLocation] = useState('Ciudad de Guatemala');
  const [rating, setRating] = useState(5);
  const [model, setModel] = useState('Quetzal Vintage 80s Snapback');
  const [comment, setComment] = useState('');

  const filteredReviews = selectedStarFilter 
    ? reviews.filter(r => r.rating === selectedStarFilter)
    : reviews;

  const averageRating = (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1);
  const fiveStarsCount = reviews.filter(r => r.rating === 5).length;
  const fourStarsCount = reviews.filter(r => r.rating === 4).length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !comment.trim()) return;

    const newRev: ProductReview = {
      id: `rev-${Date.now()}`,
      author,
      location,
      rating,
      date: 'Reciente',
      comment,
      verified: true,
      model
    };

    onAddReview(newRev);
    setIsReviewModalOpen(false);
    setAuthor('');
    setComment('');
  };

  return (
    <section className="py-12 border-t-4 border-stone-900 bg-[#FAF7F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 bg-red-600 rounded-full" />
              <span className="w-2.5 h-2.5 bg-amber-400 rounded-full" />
              <span className="w-2.5 h-2.5 bg-emerald-600 rounded-full" />
              <span className="text-xs font-black uppercase tracking-widest text-stone-600 ml-1">
                Opiniones Reales de Clientes
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-stone-900 tracking-tight uppercase">
              OPINIONES REALES DE CLIENTES EN GUATEMALA • CALIFICACIÓN 4.9/5 ⭐
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 font-medium mt-1">
              Más de 640 gorras entregadas con satisfacción 100% garantizada y pago al recibir en todo el país.
            </p>
          </div>

          <button
            id="leave-review-open-btn"
            onClick={() => setIsReviewModalOpen(true)}
            className="bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-xs px-4 py-2.5 rounded-xl border-2 border-stone-900 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2 self-start md:self-auto active:translate-x-0.5 active:translate-y-0.5 transition-all"
          >
            <MessageSquarePlus className="w-4 h-4 text-red-700" />
            DEJAR MI RESEÑA
          </button>
        </div>

        {/* Rating Overview Card */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-white border-3 border-stone-900 rounded-2xl p-6 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] mb-8">
          
          <div className="md:col-span-4 text-center md:border-r-2 md:border-stone-200 md:pr-6 flex flex-col justify-center items-center">
            <span className="text-5xl font-black text-stone-900">{averageRating}</span>
            <div className="flex text-amber-500 gap-1 my-1.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-xs font-bold text-stone-500">
              Basado en {reviews.length} opiniones verificadas
            </p>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-black px-2 py-0.5 rounded mt-2">
              ✓ 99.4% Recomienda Hatgt
            </span>
          </div>

          <div className="md:col-span-8 flex flex-col justify-center space-y-2">
            <div className="flex items-center gap-3 text-xs font-bold">
              <span className="w-14">5 estrellas</span>
              <div className="flex-1 bg-stone-100 rounded-full h-2.5 overflow-hidden border border-stone-300">
                <div className="bg-amber-400 h-full rounded-full" style={{ width: `${(fiveStarsCount / reviews.length) * 100}%` }} />
              </div>
              <span className="w-8 text-right font-black">{fiveStarsCount}</span>
            </div>
            <div className="flex items-center gap-3 text-xs font-bold">
              <span className="w-14">4 estrellas</span>
              <div className="flex-1 bg-stone-100 rounded-full h-2.5 overflow-hidden border border-stone-300">
                <div className="bg-amber-400 h-full rounded-full" style={{ width: `${(fourStarsCount / reviews.length) * 100}%` }} />
              </div>
              <span className="w-8 text-right font-black">{fourStarsCount}</span>
            </div>

            {/* Filter buttons */}
            <div className="flex gap-2 pt-2">
              <button
                id="filter-reviews-all"
                onClick={() => setSelectedStarFilter(null)}
                className={`text-[10px] font-black px-2.5 py-1 rounded-lg border transition-all ${
                  selectedStarFilter === null ? 'bg-stone-900 text-amber-300 border-stone-900' : 'bg-stone-100 text-stone-700'
                }`}
              >
                Todas ({reviews.length})
              </button>
              <button
                id="filter-reviews-5star"
                onClick={() => setSelectedStarFilter(5)}
                className={`text-[10px] font-black px-2.5 py-1 rounded-lg border transition-all ${
                  selectedStarFilter === 5 ? 'bg-stone-900 text-amber-300 border-stone-900' : 'bg-stone-100 text-stone-700'
                }`}
              >
                ⭐⭐⭐⭐⭐ Solo 5 Estrellas
              </button>
            </div>
          </div>

        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReviews.map((rev) => (
            <div 
              key={rev.id}
              className="bg-white border-2 border-stone-900 rounded-2xl p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex text-amber-500">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] text-stone-400 font-bold">{rev.date}</span>
                </div>

                <p className="text-xs text-stone-700 font-medium italic leading-relaxed">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-black text-stone-900 flex items-center gap-1">
                    {rev.author}
                    {rev.verified && <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />}
                  </h4>
                  <p className="text-[10px] text-stone-500 flex items-center gap-1 font-medium">
                    <MapPin className="w-3 h-3 text-red-600" /> {rev.location}
                  </p>
                </div>
                <span className="text-[9px] bg-stone-100 text-stone-700 font-bold px-2 py-0.5 rounded border border-stone-200 truncate max-w-[120px]">
                  {rev.model}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Modal Dejar Reseña */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border-4 border-stone-900 rounded-2xl max-w-md w-full overflow-hidden shadow-[8px_8px_0px_0px_rgba(245,158,11,1)]">
            
            <div className="bg-stone-900 text-white p-4 flex items-center justify-between">
              <h3 className="font-black text-sm text-amber-300 uppercase tracking-wider">
                DEJAR TU OPINIÓN • HATGT
              </h3>
              <button onClick={() => setIsReviewModalOpen(false)} className="text-stone-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-3 text-xs">
              <div>
                <label className="block font-black text-stone-800 mb-1">Tu Nombre Completo *</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ej: David Salazar"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full bg-stone-50 border-2 border-stone-800 rounded-lg p-2 font-medium"
                />
              </div>

              <div>
                <label className="block font-black text-stone-800 mb-1">Ubicación / Ciudad en Guate *</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ej: Antigua Guatemala, Sacatepéquez"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-stone-50 border-2 border-stone-800 rounded-lg p-2 font-medium"
                />
              </div>

              <div>
                <label className="block font-black text-stone-800 mb-1">Calificación</label>
                <div className="flex gap-2">
                  {[5, 4, 3, 2, 1].map(num => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setRating(num)}
                      className={`flex-1 py-1.5 rounded-lg border-2 font-bold ${
                        rating === num ? 'bg-amber-400 border-stone-900 text-stone-950' : 'bg-stone-50 border-stone-300'
                      }`}
                    >
                      {num} ⭐
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-black text-stone-800 mb-1">Tu Opinión sobre la Gorra *</label>
                <textarea 
                  required
                  rows={3}
                  placeholder="Cuéntanos qué te pareció la calidad del bordado, la tela o el envío contra entrega..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full bg-stone-50 border-2 border-stone-800 rounded-lg p-2 font-medium"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-stone-900 hover:bg-stone-800 text-amber-300 font-black py-3 rounded-xl border-2 border-stone-900 shadow-[3px_3px_0px_0px_rgba(220,38,38,1)] text-xs uppercase tracking-wider"
                >
                  PUBLICAR RESEÑA
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </section>
  );
};
