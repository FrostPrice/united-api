use diesel::prelude::*;
use diesel::query_builder::*;
use diesel::query_dsl::methods::LoadQuery;
use diesel::sql_types::BigInt;
use diesel::QueryId;

use crate::config::db::Connection;
use crate::config::db::Db;
use crate::utils::constants::MESSAGE_OK;

use super::response::Page;

pub trait SortingAndPaging: Sized {
    fn paginate(self, page: i64) -> SortedAndPaginated<Self>;
}

impl<T> SortingAndPaging for T {
    fn paginate(self, page: i64) -> SortedAndPaginated<Self> {
        SortedAndPaginated {
            query: self,
            sort_by: crate::utils::constants::EMPTY_STR.to_string(),
            sort_direction: crate::utils::constants::EMPTY_STR.to_string(),
            per_page: crate::utils::constants::DEFAULT_PER_PAGE,
            page,
            offset: (page - 1) * crate::utils::constants::DEFAULT_PER_PAGE,
        }
    }
}

#[derive(Debug, Clone, QueryId)]
pub struct SortedAndPaginated<T> {
    query: T,
    pub sort_by: String,
    pub sort_direction: String,
    page: i64,
    per_page: i64,
    offset: i64,
}

impl<T> SortedAndPaginated<T> {
    pub fn per_page(self, per_page: i64) -> Self {
        SortedAndPaginated {
            per_page,
            offset: (self.page - 1) * per_page,
            ..self
        }
    }

    pub fn sort(self, sort_by: String, sort_direction: String) -> Self {
        SortedAndPaginated {
            sort_by,
            sort_direction,
            ..self
        }
    }

    pub fn load_and_count_items<'a, U>(self, conn: &mut Connection) -> QueryResult<Page<U>>
    where
        Self: LoadQuery<'a, Connection, (U, i64)>,
    {
        let page = self.page;
        let per_page = self.per_page;
        let results = self.load::<(U, i64)>(conn)?;
        let total = results.first().map(|x| x.1).unwrap_or(0);
        let records = results.into_iter().map(|x| x.0).collect();
        Ok(Page::new(MESSAGE_OK, records, page, per_page, total))
    }
}

impl<T: Query> Query for SortedAndPaginated<T> {
    type SqlType = (T::SqlType, BigInt);
}

impl<T> RunQueryDsl<Connection> for SortedAndPaginated<T> {}

impl<T> QueryFragment<Db> for SortedAndPaginated<T>
where
    T: QueryFragment<Db>,
{
    fn walk_ast<'b>(&'b self, mut out: AstPass<'_, 'b, Db>) -> QueryResult<()> {
        out.push_sql("SELECT *, COUNT(*) OVER () FROM (");
        self.query.walk_ast(out.reborrow())?;
        out.push_sql(") t LIMIT ");
        out.push_bind_param::<BigInt, _>(&self.per_page)?;
        out.push_sql(" OFFSET ");
        out.push_bind_param::<BigInt, _>(&self.offset)?;

        Ok(())
    }
}
