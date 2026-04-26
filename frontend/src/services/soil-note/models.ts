export type FilterSoilNotesParams = {
  soilProfileId?: string;
  search?: string;
  tag?: string;
};

export type SoilNoteResponse = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  soilProfile: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
};

export type CreateSoilNoteRequest = {
  soilProfileId: string;
  title: string;
  description?: string;
  tags?: string[];
};

export type UpdateSoilNoteRequest = {
  soilProfileId: string;
  noteId: string;
  title?: string;
  description?: string;
  tags?: string[];
};
