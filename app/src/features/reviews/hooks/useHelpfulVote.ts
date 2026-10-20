import { skipToken } from '@reduxjs/toolkit/query';
import { useHelpfulVoteQuery } from '@/api/endpoints/reviews';
import { unvoteHelpful, voteHelpful } from '../utils/reviewBatch';
import { useBatchAction } from './useBatchAction';

export function useHelpfulVote(toolId: string, authorUid: string, voterUid: string | null) {
  const canVote = voterUid !== null && voterUid !== authorUid;
  const { currentData: voted } = useHelpfulVoteQuery(
    canVote ? { toolId, authorUid, voterUid } : skipToken,
  );
  const { run, pending, error } = useBatchAction();

  const toggle = () => {
    if (!canVote || voted === undefined) return;
    const write = voted ? unvoteHelpful : voteHelpful;
    void run((db) => write(db, toolId, authorUid, voterUid));
  };

  return { voted: voted ?? false, ready: canVote && voted !== undefined, pending, error, toggle };
}
