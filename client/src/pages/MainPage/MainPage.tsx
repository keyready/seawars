import { Page } from '@/widgets/Page';

import { LeaderboardTable } from '@/entities/Leaderboard';
import { RoomsTable } from '@/entities/Room';
import { SignupForm } from '@/entities/User';

import { useGameActions } from '@/shared/hooks/useGameSocket';
import { Card } from '@/shared/ui/Card';

export default function MainPage() {
    useGameActions();

    return (
        <Page>
            <h1 className="text-[80px]">Морской бой</h1>
            <div className="flex h-full w-full gap-10">
                <div className="flex h-full w-full flex-col gap-10">
                    <Card>
                        <h2 className="text-4xl">Топ игроков</h2>
                    </Card>
                    <Card>
                        <h2 className="text-4xl">Недавние игры</h2>
                        <LeaderboardTable />
                    </Card>
                </div>
                <div className="flex h-full w-full flex-col gap-10">
                    <Card className="h-full w-full bg-red-200">
                        <h2 className="text-4xl">Активные комнаты</h2>
                        <RoomsTable />
                    </Card>
                    <Card className="h-full w-full bg-red-200">
                        <h2 className="mb-4 text-4xl">Авторизация</h2>
                        <SignupForm />
                    </Card>
                </div>
            </div>
        </Page>
    );
}
