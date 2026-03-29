/**
 * App — Root component.
 *
 * README ref: "lib/main.dart"
 * Wraps the app in MultiProvider (AuthProvider, ProjectProvider, etc.)
 * and defines the MaterialApp (BrowserRouter on web).
 *
 * Provider hierarchy (matches mobile):
 *   AuthProvider → ProjectProvider → InvestorPaymentProvider → Router
 */

import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProjectProvider } from '@/contexts/ProjectContext';
import { InvestorPaymentProvider } from '@/contexts/InvestorPaymentContext';
import { MessagesProvider } from '@/contexts/MessagesContext';
import { BookmarksProvider } from '@/contexts/BookmarksContext';
import { ExpertProvider } from '@/contexts/ExpertContext';
import { ToastProvider } from '@/contexts/ToastContext';
import { AppRoutes } from '@/routes/AppRoutes';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ProjectProvider>
          <InvestorPaymentProvider>
            <MessagesProvider>
              <BookmarksProvider>
                <ExpertProvider>
                  <ToastProvider>
                    <AppRoutes />
                  </ToastProvider>
                </ExpertProvider>
              </BookmarksProvider>
            </MessagesProvider>
          </InvestorPaymentProvider>
        </ProjectProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
