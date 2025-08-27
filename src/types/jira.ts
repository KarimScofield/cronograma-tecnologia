export interface ConfiguracaoJira {
  id: string;
  jira_url: string;
  user_email: string;
  api_token: string;
  created_at: string;
  updated_at: string;
}

export interface JiraIssue {
  issue_id: string;
  issue_type: string;
  summary: string;
  start_date: string | null;
  due_date: string | null;
  status: string;
  progress: number;
  last_synced_at: string;
  created_at: string;
  updated_at: string;
}

export interface JiraApiResponse {
  expand: string;
  startAt: number;
  maxResults: number;
  total: number;
  issues: JiraApiIssue[];
}

export interface JiraApiIssue {
  id: string;
  key: string;
  fields: {
    summary: string;
    issuetype: {
      name: string;
    };
    status: {
      name: string;
    };
    duedate: string | null;
    customfield_10015?: string; // Start date - configurável
  };
}

export interface JiraSyncResult {
  success: boolean;
  message: string;
  itemsProcessed: number;
  errors?: string[];
}