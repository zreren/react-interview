
type Repository = {
    id: string
    name: string
    full_name: string
    open_issues_count: number
    stargazers_count: number
    forks_count: number
    url: string
    language: string
    svn_url: string
    owner: {
        login: string
        avatar_url: string
    }
}
type APIResponse = { items: Repository[]   }
export type  {Repository, APIResponse}