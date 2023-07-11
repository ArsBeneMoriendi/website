import '~/globals.sass';
import Navigation from './Navigation';

export const metadata = {
    title: 'Create Next App',
    description: 'Generated by create next app',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
                <main>
                    <Navigation />
                    {children}
                </main>
            </body>
        </html>
    );
}
