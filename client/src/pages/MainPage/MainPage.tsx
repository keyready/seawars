import { Page } from '@/widgets/Page';

import { GamesHistoryTable } from '@/entities/Leaderboard';
import { RoomsTable } from '@/entities/Room';
import { LeaderboardBlock, ProfileBlock } from '@/entities/User';

import { useGameActions } from '@/shared/hooks/useGameSocket';
import { Card } from '@/shared/ui/Card';

export default function MainPage() {
    useGameActions();

    return (
        <Page>
            <h1 className="font-cs-font text-[80px]">Морской бой</h1>
            <div className="grid h-full w-full grid-cols-2 gap-10">
                <LeaderboardBlock />
                <Card className="h-[400px] w-full bg-red-200" title="Активные комнаты">
                    <RoomsTable />
                </Card>
                <Card className="h-[750px]" title="Недавние игры">
                    <GamesHistoryTable />
                </Card>
                <ProfileBlock />
            </div>
        </Page>
    );
}
