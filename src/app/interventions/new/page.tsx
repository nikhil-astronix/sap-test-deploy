'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function NewInterventionPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'Custom' as 'Custom' | 'Default'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically make an API call to save the intervention
    console.log('Saving new intervention:', formData);
    router.push('/interventions');
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div 
        key="new-intervention-form"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
        className="p-8  w-full max-w-full h-full  bg-white rounded-lg shadow-md"
      >
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-bold mb-2 text-center">
            Interventions & Professional Development
          </h1>
          <p className="text-gray-600 text-center">
            Helping educators and students succeed together.
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6 px-48 ">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.3 }}
          >
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <motion.input
              whileFocus={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full text-sm px-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-transparent"
              placeholder="Title"
              required
            />
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.3 }}
          >
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <motion.textarea
              whileFocus={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full text-sm px-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-transparent min-h-[90px]"
              placeholder="Add your description here"
              required
            />
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.3 }}
          >
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <div className="flex gap-4 text-sm flex-col">
              {(['Default', 'Custom'] as const).map((type, index) => (
                <motion.label 
                  key={type} 
                  className="flex items-center gap-2 cursor-pointer"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.6 + (index * 0.1), duration: 0.3 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="relative flex items-center justify-center w-5 h-5">
                    <input
                      type="radio"
                      name="type"
                      value={type}
                      checked={formData.type === type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as 'Default' | 'Custom' })}
                      className="sr-only"
                    />
                    <motion.div 
                      className={`w-4 h-4 rounded-full border-2 ${
                        formData.type === type ? 'border-emerald-700' : 'border-gray-300'
                      }`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {formData.type === type && (
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-emerald-700 rounded-full" />
                      )}
                    </motion.div>
                  </div>
                  <span className="text-gray-700">{type}</span>
                </motion.label>
              ))}
            </div>
          </motion.div>

          <motion.div 
            className="flex gap-4 justify-end pt-4 text-sm"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.3 }}
          >
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/interventions')}
              className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-50 transition-colors mr-auto"
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-emerald-700 text-white px-4 py-2 rounded-lg hover:bg-emerald-800 transition-colors"
            >
              Save
            </motion.button>
          </motion.div>
        </form>
      </motion.div>
    </AnimatePresence>
  );
} 