import { MutationVariables } from '@erxes/ui/src/types';
// mutations
export type AddBoardMutationVariables = {
  name: string;
};

export type AddBoardMutationResponse = {
  addMutation: (params: {
    variables: AddBoardMutationVariables;
  }) => Promise<void>;
};

export type EditBoardMutationVariables = {
  _id?: string;
  name: string;
};

export type EditBoardMutationResponse = {
  editMutation: (params: {
    variables: EditBoardMutationVariables;
  }) => Promise<void>;
};

export type RemoveBoardMutationResponse = {
  removeMutation: (params: {
    variables: MutationVariables;
    refetchQueries: string[];
  }) => Promise<void>;
};

export type CopiedPipelineMutationResponse = {
  copiedPipelineMutation: (params: {
    variables: MutationVariables;
    refetchQueries: any[];
  }) => Promise<void>;
};

export type ArchivePipelineMutationResponse = {
  archivePipelineMutation: (params: {
    variables: MutationVariables;
    refetchQueries: any[];
  }) => Promise<void>;
};

export type RemovePipelineMutationResponse = {
  removePipelineMutation: (params: {
    variables: MutationVariables;
    refetchQueries: any[];
  }) => Promise<void>;
};

export type UpdateOrderPipelineMutationVariables = {
  orders: {
    _id: string;
    order: number;
  };
};

export type UpdateOrderPipelineMutationResponse = {
  pipelinesUpdateOrderMutation: (params: {
    variables: UpdateOrderPipelineMutationVariables;
  }) => Promise<void>;
};

export type PipelineCopyMutationVariables = {
  _id: string;
  boardId: string;
  type: string;
};

export type PipelineCopyMutationResponse = {
  pipelinesCopyMutation: (params: {
    variables: PipelineCopyMutationVariables;
  }) => Promise<void>;
};

export type PipelineCopyMutation = ({
  variables: PipelineCopyMutationVariables
}) => Promise<any>;

export type IOption = {
  modal: string;
  boardName: string;
  pipelineName: string;
  StageItem: any;
  PipelineForm: any;
  additionalButton?: string;
  additionalButtonText?: string;
};
