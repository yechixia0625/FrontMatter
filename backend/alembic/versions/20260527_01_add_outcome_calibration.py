"""Add anonymous outcome calibration storage.

Revision ID: 20260527_01
Revises:
Create Date: 2026-05-27
"""

import sqlalchemy as sa

from alembic import op

revision = "20260527_01"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "analyses",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("business_type", sa.String(), nullable=False),
        sa.Column("expected_rent", sa.Float(), nullable=False),
        sa.Column("square_meters", sa.Float(), nullable=False),
        sa.Column("photo_path", sa.String(), nullable=True),
        sa.Column("status", sa.String(), nullable=False),
        sa.Column("created_at", sa.DateTime(), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(), server_default=sa.text("now()"), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_table(
        "reports",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("analysis_id", sa.Integer(), nullable=False),
        sa.Column("report_json", sa.JSON(), nullable=False),
        sa.Column("score", sa.Integer(), nullable=False),
        sa.Column("verdict", sa.String(), nullable=False),
        sa.Column("created_at", sa.DateTime(), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(), server_default=sa.text("now()"), nullable=False),
        sa.ForeignKeyConstraint(["analysis_id"], ["analyses.id"]),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_reports_analysis_id", "reports", ["analysis_id"], unique=False)
    op.create_table(
        "outcomes",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("model_version", sa.String(), nullable=False),
        sa.Column("business_type", sa.String(), nullable=False),
        sa.Column("predicted_npv", sa.Float(), nullable=False),
        sa.Column("predicted_monthly_net_profit", sa.Float(), nullable=False),
        sa.Column("predicted_verdict", sa.String(), nullable=False),
        sa.Column("actual_monthly_net_profit", sa.Float(), nullable=False),
        sa.Column("actual_outcome", sa.String(), nullable=False),
        sa.Column("origin", sa.String(), nullable=False),
        sa.Column("created_at", sa.DateTime(), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(), server_default=sa.text("now()"), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )


def downgrade() -> None:
    op.drop_table("outcomes")
    op.drop_index("ix_reports_analysis_id", table_name="reports")
    op.drop_table("reports")
    op.drop_table("analyses")
